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
import type { ThemeOption } from 'echarts/types/src/util/types.js';
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

const theme: ThemeOption = {
  color: [
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
  ],
  backgroundColor: 'var(--ax-bg-neutral-soft)',
  textStyle: {
    color: 'var(--ax-text-neutral)',
  },
  title: {
    textStyle: {
      color: 'var(--ax-text-neutral)',
    },
    subtextStyle: {
      color: 'var(--ax-text-neutral-subtle)',
    },
  },
  line: {
    itemStyle: {
      borderWidth: '2',
    },
    lineStyle: {
      width: '3',
    },
    symbolSize: '8',
    smooth: false,
  },
  radar: {
    itemStyle: {
      borderWidth: '2',
    },
    lineStyle: {
      width: '3',
    },
    symbolSize: '8',
    smooth: false,
  },
  bar: {
    itemStyle: {
      barBorderWidth: '0',
      barBorderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  pie: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  scatter: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  boxplot: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  parallel: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  sankey: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  funnel: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: '0',
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  candlestick: {},
  graph: {},
  map: {},
  geo: {},
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisLabel: {
      show: true,
      color: 'var(--ax-text-neutral)',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['var(--ax-border-neutral-subtle)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisLabel: {
      show: true,
      color: 'var(--ax-text-neutral)',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['var(--ax-border-neutral-subtle)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisLabel: {
      show: true,
      color: 'var(--ax-text-neutral)',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['var(--ax-border-neutral-subtle)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
      },
    },
    axisLabel: {
      show: true,
      color: 'var(--ax-text-neutral)',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['var(--ax-border-neutral-subtle)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
    emphasis: {
      iconStyle: {
        borderColor: 'var(--ax-border-neutral-subtle)',
      },
    },
  },
  legend: {
    textStyle: {
      color: 'var(--ax-text-neutral)',
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: 'var(--ax-border-neutral-subtle)',
        width: 1,
      },
      crossStyle: {
        color: 'var(--ax-border-neutral-subtle)',
        width: 1,
      },
    },
  },
  markPoint: {
    label: {
      color: 'var(--ax-text-neutral)',
    },
    emphasis: {
      label: {
        color: 'var(--ax-text-neutral)',
      },
    },
  },
};
echarts.registerTheme('halloween', theme);

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

    eChartsRef.current = echarts.init(ref.current, 'halloween');

    eChartsRef.current.setOption(option);
  }, [option, theme]);

  return <div style={{ width, height }} ref={ref} />;
};
