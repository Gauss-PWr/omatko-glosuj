import { asc, count, eq, sql } from "drizzle-orm";
import { presentations, votes } from "$db/schema";
import {
  presentationType,
  type Track,
  type Type,
} from "$lib/domain/presentation";
import type { Category } from "$lib/domain/vote";
import type { DrizzleDb } from "$db/index";

const CATEGORIES_BY_TYPE: Record<Type, readonly Category[]> = {
  [presentationType.TALK]: ["t_1", "t_2"],
  [presentationType.POSTER]: ["p_1", "p_2"],
};

export type CategoryLeaderboardEntry = {
  presentationId: number;
  title: string;
  author: string;
  track: Track | null;
  averageScore: number;
  voteCount: number;
};

export type CategoryLeaderboard = {
  type: Type;
  category: Category;
  entries: CategoryLeaderboardEntry[];
};

export type StatsOverview = {
  presentationCount: number;
  ratedPresentationCount: number;
  participantCount: number;
  totalVotes: number;
  leaderboards: CategoryLeaderboard[];
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
  totalVotes: number;
  categories: PresentationCategoryStats[];
};

function roundedAverage(total: number, count: number): number | null {
  return count === 0 ? null : Math.round((total / count) * 100) / 100;
}

function leaderboardOrder(
  a: CategoryLeaderboardEntry,
  b: CategoryLeaderboardEntry,
): number {
  return (
    b.averageScore - a.averageScore ||
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

    const leaderboards = (
      Object.entries(CATEGORIES_BY_TYPE) as [Type, readonly Category[]][]
    ).flatMap(([type, categories]) =>
      categories.map((category) => {
        const entries = groupedVotes
          .filter((row) => row.type === type && row.category === category)
          .map((row) => ({
            presentationId: row.presentationId,
            title: row.title,
            author: row.author,
            track: row.track,
            averageScore: Math.round(row.averageScore * 100) / 100,
            voteCount: row.voteCount,
          }))
          .sort(leaderboardOrder);

        return { type, category, entries };
      }),
    );

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

      return {
        category,
        averageScore: roundedAverage(scoreTotal, voteCount),
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
      totalVotes: categories.reduce(
        (total, category) => total + category.voteCount,
        0,
      ),
      categories,
    };
  }
}
