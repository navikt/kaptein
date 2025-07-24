import type { ThemeOption } from 'echarts/types/src/util/types.js';

export const theme: ThemeOption = {
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
