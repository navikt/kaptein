import type { ThemeOption } from 'echarts/types/src/util/types.js';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';

const COLORS = [
  ColorToken.Accent500,
  ColorToken.Warning500,
  ColorToken.Success500,
  ColorToken.Danger500,
  ColorToken.Info500,
  ColorToken.Magenta500,
  ColorToken.Lime500,
  ColorToken.Purple500,
  ColorToken.Beige500,
  ColorToken.Neutral500,

  ColorToken.Accent800,
  ColorToken.Warning800,
  ColorToken.Success800,
  ColorToken.Danger800,
  ColorToken.Info800,
  ColorToken.Magenta800,
  ColorToken.Lime800,
  ColorToken.Purple800,
  ColorToken.Beige800,
  ColorToken.Neutral800,
];

const fontSize = '0.875rem'; // Aksel token doesn't work

const theme: ThemeOption = {
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
      fontSize,
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 1,
    },
    symbolSize: 4,
    smooth: false,
    emphasis: {
      disabled: true,
      label: {
        shadowBlur: 0,
        color: 'var(--ax-text-neutral)',
      },
    },
  },
  grid: {
    left: 0,
    right: 0,
  },
  radar: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 3,
    },
    symbolSize: 8,
    smooth: false,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: 'var(--ax-border-neutral-subtle)',
    },
    emphasis: {
      label: {
        shadowBlur: 0,
        color: 'var(--ax-text-neutral)',
      },
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
    label: {
      color: 'var(--ax-text-neutral)',
      fontSize,
    },
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
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
      fontSize,
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
      fontSize,
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
      fontSize,
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
      fontSize,
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
      fontSize,
    },
  },
  tooltip: {
    backgroundColor: 'var(--ax-bg-raised)',
    borderColor: 'var(--ax-border-neutral-subtle)',
    textStyle: {
      color: 'var(--ax-text-neutral)',
    },
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

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const LIGHT_THEME = {
  ...theme,
  color: COLORS.map((c) => LIGHT[c]),
};

export const DARK_THEME = {
  ...theme,
  color: COLORS.map((c) => DARK[c]),
};
