import { count, eq, sql } from "drizzle-orm";
import { presentations, votes } from "$db/schema";
import {
  presentationType,
  type Track,
  type Type,
} from "$lib/domain/presentation";
import type { Category } from "$lib/domain/vote";
import type { DrizzleDb } from "$db/index";

const CATEGORIES_BY_TYPE: Record<Type, readonly [Category, Category]> = {
  [presentationType.TALK]: ["t_1", "t_2"],
  [presentationType.POSTER]: ["p_1", "p_2"],
};

export type StatsGroup = "applied" | "theory" | "poster";

export type CategoryScore = {
  category: Category;
  averageScore: number;
  voteCount: number;
};

export type LeaderboardEntry = {
  presentationId: number;
  title: string;
  author: string;
  track: Track | null;
  score: number;
  voteCount: number;
  categoryScores: [CategoryScore, CategoryScore];
};

export type Leaderboard = {
  group: StatsGroup;
  entries: LeaderboardEntry[];
};

export type StatsOverview = {
  presentationCount: number;
  ratedPresentationCount: number;
  participantCount: number;
  totalVotes: number;
  leaderboards: Leaderboard[];
};

export type ScoreDistribution = {
  score: number;
  voteCount: number;
};

export type PresentationCategoryStats = {
  category: Category;
  averageScore: number | null;
  voteCount: number;
  distribution: ScoreDistribution[];
};

export type PresentationStats = {
  presentation: {
    id: number;
    title: string;
    author: string;
    abstract: string | null;
    type: Type;
    track: Track | null;
  };
  score: number | null;
  totalVotes: number;
  categories: PresentationCategoryStats[];
};

type GroupedPresentationVotes = {
  presentationId: number;
  type: Type;
  title: string;
  author: string;
  track: Track | null;
  categoryScores: Map<Category, { averageScore: number; voteCount: number }>;
};

const STATS_GROUPS: StatsGroup[] = ["applied", "theory", "poster"];

function groupFor(type: Type, track: Track | null): StatsGroup | null {
  if (type === presentationType.POSTER) return "poster";
  if (track === "applied" || track === "theory") return track;
  return null;
}

function roundedScore(score: number): number {
  return Math.round(score * 100) / 100;
}

function weightedScore(
  type: Type,
  categoryAverages: ReadonlyMap<Category, number | null>,
): number | null {
  const [first, second] = CATEGORIES_BY_TYPE[type];
  const firstAverage = categoryAverages.get(first);
  const secondAverage = categoryAverages.get(second);
  if (firstAverage == null || secondAverage == null) return null;
  return roundedScore(6 * firstAverage + 4 * secondAverage);
}

function leaderboardOrder(a: LeaderboardEntry, b: LeaderboardEntry): number {
  return (
    b.score - a.score ||
    b.voteCount - a.voteCount ||
    a.title.localeCompare(b.title, "pl")
  );
}

export class StatsService {
  constructor(private readonly db: DrizzleDb) {}

  async getOverview(): Promise<StatsOverview> {
    const [presentationTotals] = await this.db
      .select({ presentationCount: count() })
      .from(presentations);

    const [voteTotals] = await this.db
      .select({
        ratedPresentationCount:
          sql<number>`count(distinct ${votes.presentationId})`.mapWith(Number),
        participantCount: sql<number>`count(distinct ${votes.userId})`.mapWith(
          Number,
        ),
        totalVotes: count(),
      })
      .from(votes);

    const groupedVotes = await this.db
      .select({
        presentationId: presentations.id,
        type: presentations.type,
        title: presentations.title,
        author: presentations.author,
        track: presentations.track,
        category: votes.category,
        averageScore: sql<number>`avg(${votes.score})`.mapWith(Number),
        voteCount: count(),
      })
      .from(presentations)
      .innerJoin(votes, eq(votes.presentationId, presentations.id))
      .groupBy(presentations.id, votes.category);

    const presentationsById = new Map<number, GroupedPresentationVotes>();
    for (const row of groupedVotes) {
      const item = presentationsById.get(row.presentationId) ?? {
        presentationId: row.presentationId,
        type: row.type,
        title: row.title,
        author: row.author,
        track: row.track,
        categoryScores: new Map(),
      };
      item.categoryScores.set(row.category, {
        averageScore: row.averageScore,
        voteCount: row.voteCount,
      });
      presentationsById.set(row.presentationId, item);
    }

    const leaderboards = STATS_GROUPS.map((group) => {
      const entries: LeaderboardEntry[] = [];
      for (const item of presentationsById.values()) {
        if (groupFor(item.type, item.track) !== group) continue;

        const categoryScores = CATEGORIES_BY_TYPE[item.type].map((category) => {
          const result = item.categoryScores.get(category);
          if (!result) return null;
          return {
            category,
            averageScore: roundedScore(result.averageScore),
            voteCount: result.voteCount,
          };
        });
        const firstCategoryScore = categoryScores[0];
        const secondCategoryScore = categoryScores[1];
        if (!firstCategoryScore || !secondCategoryScore) continue;

        const score = weightedScore(
          item.type,
          new Map(
            [...item.categoryScores].map(([category, result]) => [
              category,
              result.averageScore,
            ]),
          ),
        );
        if (score === null) continue;

        entries.push({
          presentationId: item.presentationId,
          title: item.title,
          author: item.author,
          track: item.track,
          score,
          voteCount:
            firstCategoryScore.voteCount + secondCategoryScore.voteCount,
          categoryScores: [firstCategoryScore, secondCategoryScore],
        });
      }

      return { group, entries: entries.sort(leaderboardOrder) };
    });

    return {
      presentationCount: presentationTotals?.presentationCount ?? 0,
      ratedPresentationCount: voteTotals?.ratedPresentationCount ?? 0,
      participantCount: voteTotals?.participantCount ?? 0,
      totalVotes: voteTotals?.totalVotes ?? 0,
      leaderboards,
    };
  }

  async getPresentationStats(
    presentationId: number,
  ): Promise<PresentationStats | null> {
    const [presentation] = await this.db
      .select({
        id: presentations.id,
        title: presentations.title,
        author: presentations.author,
        abstract: presentations.abstract,
        type: presentations.type,
        track: presentations.track,
      })
      .from(presentations)
      .where(eq(presentations.id, presentationId))
      .limit(1);

    if (!presentation) return null;

    const groupedScores = await this.db
      .select({
        category: votes.category,
        score: votes.score,
        voteCount: count(),
      })
      .from(votes)
      .where(eq(votes.presentationId, presentationId))
      .groupBy(votes.category, votes.score);

    const rawAverages = new Map<Category, number | null>();
    const categories = CATEGORIES_BY_TYPE[presentation.type].map((category) => {
      const distribution = new Map<number, number>();
      for (const row of groupedScores) {
        if (row.category === category)
          distribution.set(row.score, row.voteCount);
      }

      const voteCount = [...distribution.values()].reduce(
        (total, votesForScore) => total + votesForScore,
        0,
      );
      const scoreTotal = [...distribution.entries()].reduce(
        (total, [score, votesForScore]) => total + score * votesForScore,
        0,
      );
      const average = voteCount === 0 ? null : scoreTotal / voteCount;
      rawAverages.set(category, average);

      return {
        category,
        averageScore: average === null ? null : roundedScore(average),
        voteCount,
        distribution: Array.from({ length: 6 }, (_, score) => ({
          score,
          voteCount: distribution.get(score) ?? 0,
        })),
      };
    });

    return {
      presentation: {
        ...presentation,
        track: presentation.track ?? null,
      },
      score: weightedScore(presentation.type, rawAverages),
      totalVotes: categories.reduce(
        (total, category) => total + category.voteCount,
        0,
      ),
      categories,
    };
  }
}
