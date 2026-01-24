'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheaterReviewPopularity } from 'src/hooks/review/useTheaterReviewPopularity';
import 'src/lib/chartConfig';

// 라벨 축약 길이
const MAX_LABEL_LENGTH = 12;

const truncateLabel = (label: string) =>
  label.length > MAX_LABEL_LENGTH ? `${label.slice(0, MAX_LABEL_LENGTH)}…` : label;

const TopReviewChart = () => {
  const { data: rankings = [] } = useTheaterReviewPopularity();

  // 전체 이름 / 줄인 이름 따로 관리
  const { labels, shortLabels, values } = useMemo(() => {
    const full = rankings.map((r) => r.name || '알 수 없음');
    const short = full.map(truncateLabel);
    const vals = rankings.map((r) => r.count);
    return { labels: full, shortLabels: short, values: vals };
  }, [rankings]);

  const chartData = useMemo(
    () => ({
      labels: shortLabels, // 축에는 줄인 이름만
      datasets: [
        {
          label: '리뷰 수',
          data: values,
          backgroundColor: '#C9A66B',
          borderRadius: 6,
          maxBarThickness: 24,
        },
      ],
    }),
    [shortLabels, values],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y' as const,

      layout: {
        padding: { top: 10, right: 20, bottom: 10, left: 10 },
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111',
          titleColor: '#fff',
          bodyColor: '#C9A66B',
          callbacks: {
            // 툴팁에는 풀네임 보여주기
            title: (items: any) => {
              const idx = items[0].dataIndex;
              return labels[idx] ?? '';
            },
          },
        },
      },

      scales: {
        y: {
          ticks: {
            color: '#eee',
            // 혹시라도 너무 길면 여기서도 한 번 더 잘라줌
            callback: (value: string | number) => {
              const idx =
                typeof value === 'number'
                  ? value
                  : (shortLabels as string[]).findIndex((v) => v === value);
              const label = shortLabels[idx] ?? value;
              return label;
            },
            font: {
              size: 11,
            },
          },
          grid: {
            display: false,
          },
        },
        x: {
          beginAtZero: true,
          ticks: {
            color: '#aaa',
            stepSize: 1, // 리뷰 수라면 정수 단위로
          },
          grid: {
            color: '#222',
          },
        },
      },
    }),
    [labels, shortLabels],
  );

  return (
    <div className="h-[260px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopReviewChart;
