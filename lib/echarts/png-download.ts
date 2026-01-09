import type { ECharts } from 'echarts/core';
import { renderChartToCanvas } from '@/lib/echarts/png-render';
import { formatFileName } from '@/lib/format';

/**
 * Downloads the ECharts chart as a high-resolution PNG image.
 */
export const downloadChartAsPng = async (
  chart: ECharts | null,
  titleElement: HTMLElement | null,
  descriptionElement: HTMLElement | null,
): Promise<void> => {
  const result = await renderChartToCanvas(chart, titleElement, descriptionElement);

  if (result === null) {
    return;
  }

  const { canvas, title } = result;

  const pngUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = formatFileName(title, 'png');
  link.href = pngUrl;
  link.click();
};
