import type { ECharts } from 'echarts/core';

export const resetDataZoomOnDblClick = (eChartsInstance: ECharts) => {
  eChartsInstance
    .getZr()
    .on('dblclick', () => eChartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100 }));
};
