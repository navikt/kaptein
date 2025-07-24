'use client';

import { BarChart, LineChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { useEffect, useRef, useState } from 'react';

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
]);

type Props = {
  option: ECBasicOption;
  width?: string;
  height?: string;
};

export const EChart = ({ option, width = '100%', height = '100%' }: Props) => {
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

    eChartsRef.current.setOption(option);
  }, [option]);

  return <div style={{ width, height }} ref={ref} />;
};

export const EChartTest = () => (
  <EChart
    option={{
      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
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
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(128, 255, 165)',
              },
              {
                offset: 1,
                color: 'rgb(1, 191, 236)',
              },
            ]),
          },
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
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(0, 221, 255)',
              },
              {
                offset: 1,
                color: 'rgb(77, 119, 255)',
              },
            ]),
          },
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
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(55, 162, 255)',
              },
              {
                offset: 1,
                color: 'rgb(116, 21, 219)',
              },
            ]),
          },
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
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 0, 135)',
              },
              {
                offset: 1,
                color: 'rgb(135, 0, 157)',
              },
            ]),
          },
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
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 191, 0)',
              },
              {
                offset: 1,
                color: 'rgb(224, 62, 76)',
              },
            ]),
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
