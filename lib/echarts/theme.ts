import type { ThemeOption } from 'echarts/types/src/util/types.js';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';

const DARK_COLORS = [
  DARK[ColorToken.Accent500],
  DARK[ColorToken.Warning500],
  DARK[ColorToken.Success500],
  DARK[ColorToken.Danger500],
  DARK[ColorToken.Info500],
  DARK[ColorToken.Magenta500],
  DARK[ColorToken.Lime500],
  DARK[ColorToken.Purple500],
  DARK[ColorToken.Beige500],
  DARK[ColorToken.Neutral500],

  DARK[ColorToken.Accent800],
  DARK[ColorToken.Warning800],
  DARK[ColorToken.Success800],
  DARK[ColorToken.Danger800],
  DARK[ColorToken.Info800],
  DARK[ColorToken.Magenta800],
  DARK[ColorToken.Lime800],
  DARK[ColorToken.Purple800],
  DARK[ColorToken.Beige800],
  DARK[ColorToken.Neutral800],
];

const LIGHT_COLORS = [
  LIGHT[ColorToken.Accent500],
  LIGHT[ColorToken.Warning500],
  LIGHT[ColorToken.Success500],
  LIGHT[ColorToken.Danger500],
  LIGHT[ColorToken.Info500],
  LIGHT[ColorToken.Magenta500],
  LIGHT[ColorToken.Lime500],
  LIGHT[ColorToken.Purple500],
  LIGHT[ColorToken.Beige500],
  LIGHT[ColorToken.Neutral500],

  LIGHT[ColorToken.Accent800],
  LIGHT[ColorToken.Warning800],
  LIGHT[ColorToken.Success800],
  LIGHT[ColorToken.Danger800],
  LIGHT[ColorToken.Info800],
  LIGHT[ColorToken.Magenta800],
  LIGHT[ColorToken.Lime800],
  LIGHT[ColorToken.Purple800],
  LIGHT[ColorToken.Beige800],
  LIGHT[ColorToken.Neutral800],
];

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
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 3,
    },
    symbolSize: 8,
    smooth: false,
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
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: 'var(--ax-border-neutral-subtle)',
    },
    label: {
      color: 'var(--ax-text-neutral)',
    },
    emphasis: {
      color: ['red'],
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

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const LIGHT_THEME = {
  ...theme,
  color: LIGHT_COLORS,
};

export const DARK_THEME = {
  ...theme,
  color: DARK_COLORS,
};
