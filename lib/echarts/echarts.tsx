'use client';

import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
// biome-ignore lint/performance/noNamespaceImport: https://echarts.apache.org/handbook/en/basics/import
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { useEffect, useRef, useState } from 'react';
import { useAppTheme } from '@/lib/app-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  LineChart,
  PieChart,
]);

type Props = {
  option: ECBasicOption;
  width?: string;
  height?: string;
};

const textStyle = {
  color: 'var(--ax-text-neutral)',
};

const subtextStyle = {
  color: 'var(--ax-text-neutral-subtle)',
};

const backgroundColor = 'var(--ax-bg-neutral-soft)';

const color = [
  'var(--ax-accent-500)',
  'var(--ax-warning-500)',
  'var(--ax-success-500)',
  'var(--ax-danger-500)',
  'var(--ax-info-500)',
  'var(--ax-brand-magenta-500)',
  'var(--ax-meta-lime-500)',
  'var(--ax-meta-purple-500)',
  'var(--ax-brand-beige-500)',
  'var(--ax-neutral-500)',

  'var(--ax-accent-800)',
  'var(--ax-warning-800)',
  'var(--ax-success-800)',
  'var(--ax-danger-800)',
  'var(--ax-info-800)',
  'var(--ax-brand-magenta-800)',
  'var(--ax-meta-lime-800)',
  'var(--ax-meta-purple-800)',
  'var(--ax-brand-beige-800)',
  'var(--ax-neutral-800)',

  // 'var(--ax-brand-blue-500)', // Same as info
];

export const EChart = ({ option, width = '100%', height = '100%' }: Props) => {
  const theme = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const eChartsRef = useRef<echarts.ECharts | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        setSize({ width, height });
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (eChartsRef.current === null) {
      return;
    }

    eChartsRef.current.resize();
  }, [size.width, size.height]);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    eChartsRef.current = echarts.init(ref.current);

    eChartsRef.current.setOption({
      ...option,
      color,
      title: { ...(option.title ?? {}), textStyle, subtextStyle },
      textStyle,
      backgroundColor,
    });
  }, [option, theme]);

  return <div style={{ width, height }} ref={ref} />;
};

const option: echarts.EChartsCoreOption = {
  title: {
    text: 'Waterfall Chart',
    subtext: 'Living Expenses in Shenzhen',
    textStyle: textStyle,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {},
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  series: [
    {
      name: 'Direct',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 302, 301, 334, 390, 330, 320, 320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: 'Mail Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Affiliate Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [150, 212, 201, 154, 190, 330, 410, 150, 212, 201, 154, 190, 330, 410],
    },
    {
      name: 'Search Engine',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320, 820, 832, 901, 934, 1290, 1330, 1320],
    },

    {
      name: 'Dirsdsdfect',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 302, 301, 334, 390, 330, 320, 320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: 'Mailasdafdsfa Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Affiliasdfsdfsate Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Videsdfsdfsdfo Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [150, 212, 201, 154, 190, 330, 410, 150, 212, 201, 154, 190, 330, 410],
    },
    {
      name: 'Searsdfsadfasch Engine',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320, 820, 832, 901, 934, 1290, 1330, 1320],
    },

    {
      name: 'Dsdafasdfsadfirect',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 302, 301, 334, 390, 330, 320, 320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: 'Mail sdfasdfasdfsAd',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Affiliate sdfsdfsdAd',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Asdfsdfsd',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [150, 212, 201, 154, 190, 330, 410, 150, 212, 201, 154, 190, 330, 410],
    },
    {
      name: 'Search Enginesdfds',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320, 820, 832, 901, 934, 1290, 1330, 1320],
    },
  ],
};

export const Pie = () => {
  return <EChart option={{ ...option }} />;
};

export const EChartTest = () => (
  <EChart
    option={{
      title: {
        text: 'Gradient Stacked Area Chart',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        show: false,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          show: true,
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      ],
      yAxis: [
        {
          axisLine: { show: false },
          splitLine: { show: false },
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Line 1',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [140, 232, 101, 264, 90, 340, 250],
        },
        {
          name: 'Line 2',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [120, 282, 111, 234, 220, 340, 310],
        },
        {
          name: 'Line 3',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [320, 132, 201, 334, 190, 130, 220],
        },
        {
          name: 'Line 4',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [220, 402, 231, 134, 190, 230, 120],
        },
        {
          name: 'Line 5',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
          emphasis: {
            focus: 'series',
          },
          data: [220, 302, 181, 234, 210, 290, 150],
        },
      ],
    }}
  />
);
