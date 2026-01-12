'use client';

import { DownloadIcon, FilesIcon, TableIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, HelpText, HStack, Modal, Tooltip, VStack } from '@navikt/ds-react';
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
import { copyTable } from '@/lib/echarts/copy-table';
import { downloadChartDataAsCsv } from '@/lib/echarts/csv-download';
import { DataViewTable } from '@/lib/echarts/data-view-table';
import { copyChartAsPng } from '@/lib/echarts/png-clipboard';
import { downloadChartAsPng } from '@/lib/echarts/png-download';
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
  title: string;
  description?: ReactNode;
  helpText?: ReactNode;
  getInstance?: (instance: ECharts) => void;
  headerContent?: ReactNode;
  /** If true, numeric values are treated as decimals and formatted as percentages in the data table */
  isPercentage?: boolean;
}

interface EChartProps extends CommonChartProps {
  option: Omit<ECBasicOption, 'title'>;
}

export const EChart = ({
  option,
  title,
  description,
  getInstance,
  helpText,
  headerContent,
  isPercentage,
}: EChartProps) => {
  const theme = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const eChartsRef = useRef<ECharts | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
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

  const tableRef = useRef<HTMLTableElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  return (
    <VStack height="100%" width="100%" gap="4">
      <VStack align="center" position="relative">
        <HStack gap="2" align="center" paddingInline="6">
          <Heading size="small" level="1" ref={titleRef}>
            {title}
          </Heading>

          {helpText !== undefined && <HelpText>{helpText}</HelpText>}
        </HStack>

        <BodyLong size="small" ref={descriptionRef}>
          {description}
        </BodyLong>

        <HStack gap="1" position="absolute" top="0" right="0">
          <Tooltip content="Kopier som PNG" describesChild>
            <Button
              variant="tertiary-neutral"
              size="xsmall"
              onClick={() => copyChartAsPng(eChartsRef.current, titleRef.current, descriptionRef.current)}
              icon={<FilesIcon aria-hidden />}
            />
          </Tooltip>

          <Tooltip content="Last ned som PNG" describesChild>
            <Button
              variant="tertiary-neutral"
              size="xsmall"
              onClick={() => downloadChartAsPng(eChartsRef.current, titleRef.current, descriptionRef.current)}
              icon={<DownloadIcon aria-hidden />}
            />
          </Tooltip>

          <Tooltip content="Vis data som tabell" describesChild>
            <Button
              variant="tertiary-neutral"
              size="xsmall"
              onClick={() => modalRef.current?.showModal()}
              icon={<TableIcon aria-hidden />}
            />
          </Tooltip>
        </HStack>

        {headerContent}
      </VStack>

      <div ref={ref} className="grow" />

      <Modal ref={modalRef} header={{ heading: title }} className="w-fit! min-w-xl max-w-[95vw]!" closeOnBackdropClick>
        <Modal.Body>
          <BodyLong size="small" spacing>
            {description}
          </BodyLong>

          <DataViewTable option={optionWithAria} isPercentage={isPercentage} ref={tableRef} />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            size="small"
            icon={<FilesIcon aria-hidden />}
            onClick={() => copyTable(tableRef.current, titleRef.current, descriptionRef.current)}
          >
            Kopier tabell
          </Button>

          <Button
            variant="secondary"
            size="small"
            icon={<DownloadIcon aria-hidden />}
            onClick={() => downloadChartDataAsCsv(optionWithAria, title)}
          >
            Last ned som CSV (Excel)
          </Button>
        </Modal.Footer>
      </Modal>
    </VStack>
  );
};
