'use client';

import { Heading, HelpText, HStack, VStack } from '@navikt/ds-react';
import { BarChart, CustomChart, LineChart, PieChart, SankeyChart, SunburstChart, TreemapChart } from 'echarts/charts';
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
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
  TreemapChart,
  SunburstChart,
  SankeyChart,
  CustomChart,
  DataZoomComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
]);

echarts.registerTheme(AppTheme.DARK, DARK_THEME);
echarts.registerTheme(AppTheme.LIGHT, LIGHT_THEME);
echarts.registerLocale('nb-NO', nbNO);

export interface CommonChartProps {
  title: ReactNode;
  description?: ReactNode;
  helpText?: ReactNode;
  getInstance?: (instance: ECharts) => void;
}

interface EChartProps extends CommonChartProps {
  option: Omit<ECBasicOption, 'title'>;
}

export const EChart = ({ option, title, description, getInstance, helpText }: EChartProps) => {
  const theme = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const eChartsRef = useRef<ECharts | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const optionWithAria = useMemo(() => ({ ...option, aria: { show: true } }), [option]);

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

    eChartsRef.current.setOption(optionWithAria, { notMerge: true, lazyUpdate: true });
  }, [optionWithAria]);

  // Initialize ECharts instance
  useEffect(() => {
    if (ref.current === null || eChartsRef.current !== null) {
      return;
    }

    eChartsRef.current = echarts.init(ref.current, theme, { locale: 'nb-NO' });

    eChartsRef.current.setOption(optionWithAria);

    if (getInstance !== undefined) {
      getInstance(eChartsRef.current);
    }
  }, [optionWithAria, theme, getInstance]);

  // Update theme when it changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: setOption(option) is a workaround for a bug in ECharts
  useEffect(() => {
    if (eChartsRef.current === null) {
      return;
    }

    eChartsRef.current.setTheme(theme);
    // Without this eChart would show data from previous filtering after changing theme
    eChartsRef.current.setOption(optionWithAria);
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

  return (
    <VStack height="100%" width="100%" gap="4">
      <VStack align="center">
        <HStack gap="2" align="center">
          <Heading size="small" level="1">
            {title}
          </Heading>

          {helpText !== undefined && <HelpText>{helpText}</HelpText>}
        </HStack>
        <Heading size="xsmall" level="2" className="font-normal!">
          {description}
        </Heading>
      </VStack>

      <div ref={ref} className="grow" />
    </VStack>
  );
};
