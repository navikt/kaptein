'use client';

import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  AriaComponent,
  DatasetComponent,
  DataZoomComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components';
import type { ECharts } from 'echarts/core';
// biome-ignore lint/performance/noNamespaceImport: https://echarts.apache.org/handbook/en/basics/import
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
// @ts-expect-error - No types available
import nbNO from 'echarts/lib/i18n/langnb-NO.js';
import { SVGRenderer } from 'echarts/renderers';
import type { ECBasicOption, TitleOption } from 'echarts/types/dist/shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { DARK_THEME, LIGHT_THEME } from '@/lib/echarts/theme';

echarts.use([
  AriaComponent,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  MarkAreaComponent,
  MarkLineComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  LineChart,
  PieChart,
  DataZoomComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
]);

echarts.registerTheme(AppTheme.DARK, DARK_THEME);
echarts.registerTheme(AppTheme.LIGHT, LIGHT_THEME);
echarts.registerLocale('nb-NO', nbNO);

export interface CommonChartProps {
  title: string;
  description?: string;
  width?: string;
  height?: string;
  className?: string;
  getInstance?: (instance: ECharts) => void;
}

interface EChartProps extends CommonChartProps {
  option: ECBasicOption & { title?: Omit<TitleOption, 'text' | 'subtext'> };
}

export const EChart = ({
  option,
  title,
  description,
  width = '100%',
  height = '100%',
  className,
  getInstance,
}: EChartProps) => {
  const theme = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const eChartsRef = useRef<ECharts | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const optionWithTitle = useMemo(
    () => ({
      ...option,
      title: {
        ...option.title,
        text: title,
        subtext: description,
        subtextStyle: { rich: { bold: { fontWeight: 'bold' } } },
      },
      aria: { show: true },
    }),
    [option, title, description],
  );

  // Create ResizeObserver to update chart size when container size changes
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Resize ECharts when container size changes
  useEffect(() => {
    if (eChartsRef.current === null) {
      return;
    }

    eChartsRef.current.resize();
  }, [size.width, size.height]);

  // Update ECharts options when option prop changes
  useEffect(() => {
    if (eChartsRef.current === null) {
      return;
    }

    eChartsRef.current.setOption(optionWithTitle, { notMerge: true, lazyUpdate: true });
  }, [optionWithTitle]);

  // Initialize ECharts instance
  useEffect(() => {
    if (ref.current === null || eChartsRef.current !== null) {
      return;
    }

    eChartsRef.current = echarts.init(ref.current, theme, { locale: 'nb-NO' });

    eChartsRef.current.setOption(optionWithTitle);

    if (getInstance !== undefined) {
      getInstance(eChartsRef.current);
    }
  }, [optionWithTitle, theme, getInstance]);

  // Update theme when it changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: setOption(option) is a workaround for a bug in ECharts
  useEffect(() => {
    if (eChartsRef.current === null) {
      return;
    }

    eChartsRef.current.setTheme(theme);
    // Without this eChart would show data from previous filtering after changing theme
    eChartsRef.current.setOption(optionWithTitle);
  }, [theme]);

  // Dispose ECharts instance on unmount
  useEffect(() => {
    return () => {
      if (eChartsRef.current !== null) {
        eChartsRef.current.dispose();
        eChartsRef.current = null;
      }
    };
  }, []);

  return <div style={{ width, height }} ref={ref} className={`${className} [&_svg]:select-text!`} />;
};
