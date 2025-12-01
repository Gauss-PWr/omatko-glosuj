import type { LectureScore, PosterScore } from "@/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the category scale

enum Colors {
  ORANGE = "#f28f2def",
  BLUE = "#4fbdc3ef",
  GREEN = "#91c13fef",
}

const Histogram = ({
  dataset,
}: {
  dataset: {
    stosowana: LectureScore[];
    teoretyczna: LectureScore[];
    plakaty: PosterScore[];
  };
}) => {
  function linspace(start: number, end: number, num: number): number[] {
    if (num === 1) return [start];
    const step = (end - start) / (num - 1);
    return Array.from(
      { length: num },
      (_, i) => +(start + step * i).toFixed(6)
    );
  }

  function binData(
    data: (number | null | undefined)[],
    bins: number[]
  ): number[] {
    const binCounts = new Array(bins.length).fill(0);
    const numeric = data.filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v)
    );

    for (const value of numeric) {
      // if value equals the last edge, put it in the last bin
      if (value === bins[bins.length - 1]) {
        binCounts[bins.length - 1]++;
        continue;
      }
      // use [prevEdge, nextEdge) intervals for all but the last bin
      for (let i = 1; i < bins.length; i++) {
        if (value >= bins[i - 1] && value < bins[i]) {
          binCounts[i - 1]++;
          break;
        }
      }
    }

    return binCounts;
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = linspace(1, 10, 19);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Stosowana",
        data: Array.isArray(dataset.stosowana)
          ? binData(
              dataset.stosowana.map((item) => item?.score ?? null),
              labels
            )
          : [],
        backgroundColor: Colors.ORANGE,
      },
      {
        label: "Teoretyczna",
        data: Array.isArray(dataset.teoretyczna)
          ? binData(
              dataset.teoretyczna.map((item) => item?.score ?? null),
              labels
            )
          : [],
        backgroundColor: Colors.BLUE,
      },
      {
        label: "Plakaty",
        data: Array.isArray(dataset.plakaty)
          ? binData(
              dataset.plakaty.map((item) => item?.score ?? null),
              labels
            )
          : [],
        backgroundColor: Colors.GREEN,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom" as const,
        },
        title: {
          display: true,
          text: "Rozkład wyników",
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          min: 0,
          suggestedMax: 10,
        },
      },
    },
  };

  return <Bar data={data} options={config.options} />;
};

export default Histogram;
