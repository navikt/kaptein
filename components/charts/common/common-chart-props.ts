export const COMMON_BAR_CHART_PROPS = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value' },
};

export const COMMON_STACKED_BAR_CHART_PROPS = {
  ...COMMON_BAR_CHART_PROPS,
  legend: {},
};

export const COMMMON_STACKED_BAR_CHART_SERIES_PROPS = {
  type: 'bar',
  stack: 'total',
  label: { show: true },
  emphasis: { focus: 'series' },
};

export const COMMON_PIE_CHART_PROPS = {
  tooltip: { trigger: 'item' },
  legend: {},
};

export const COMMON_PIE_CHART_SERIES_PROPS = {
  type: 'pie',
  top: -100,
};
