import dynamic from 'next/dynamic';
import React from 'react';
import { usePopularityTheater } from 'src/hooks/reservation/usePopularityTheater';

// ApexCharts는 SSR 지원 X
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const TopReservation = () => {
  const { data } = usePopularityTheater();

  const series = data?.map((t) => t.value) ?? [];

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: 'dark' },
    labels: data?.map((t) => t.name) ?? [],
    colors: ['#C9A66B', '#8E7754', '#E3C58A', '#6F5A3C'],
    legend: { position: 'bottom', labels: { colors: '#aaa' } },
    tooltip: {
      theme: 'dark',
    },
    plotOptions: {
      pie: {
        donut: { size: '65%' },
      },
    },
  };

  return <Chart options={options} series={series} type="donut" height={300} />;
};

export default TopReservation;
