import type { ECharts } from 'echarts/core';
import { renderChartToCanvas } from '@/lib/echarts/png-render';

/**
 * Copies the ECharts chart as a high-resolution PNG image to the clipboard.
 */
export const copyChartAsPng = async (
  chart: ECharts | null,
  titleElement: HTMLElement | null,
  descriptionElement: HTMLElement | null,
): Promise<void> => {
  const result = await renderChartToCanvas(chart, titleElement, descriptionElement);

  if (result === null) {
    return;
  }

  const { canvas } = result;

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

  if (blob === null) {
    return;
  }

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  } catch (error) {
    console.error('Failed to copy chart as PNG to clipboard:', error);
  }
};
