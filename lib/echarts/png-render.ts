import type { ECharts } from 'echarts/core';

interface RenderChartResult {
  canvas: HTMLCanvasElement;
  title: string;
}

const SCALE_FACTOR = 3; // 3x resolution for high quality
const PADDING = 20;

/**
 * Renders an ECharts chart to a canvas element.
 * Combines title, description, and chart into a single canvas image.
 * Returns the canvas and title text, or null if rendering fails.
 */
export const renderChartToCanvas = async (
  chart: ECharts | null,
  titleElement: HTMLElement | null,
  descriptionElement: HTMLElement | null,
): Promise<RenderChartResult | null> => {
  if (chart === null) {
    return null;
  }

  const chartSvgElement = chart.getDom().querySelector('svg');

  if (chartSvgElement === null) {
    return null;
  }

  const chartRect = chartSvgElement.getBoundingClientRect();
  const titleRect = titleElement?.getBoundingClientRect();
  const descriptionRect = descriptionElement?.getBoundingClientRect();

  const hasTitle = titleRect !== undefined && titleRect.height > 0;
  const hasDescription = descriptionRect !== undefined && descriptionRect.height > 0;

  // Get computed styles for title and description
  const titleStyles = titleElement !== null ? getComputedStyle(titleElement) : null;
  const descriptionStyles = descriptionElement !== null ? getComputedStyle(descriptionElement) : null;

  // Calculate dimensions
  const contentWidth = chartRect.width;
  const titleHeight = hasTitle ? titleRect.height : 0;
  const descriptionHeight = hasDescription ? descriptionRect.height : 0;
  const headerHeight =
    PADDING + titleHeight + (hasDescription ? descriptionHeight : 0) + (hasTitle || hasDescription ? PADDING : 0);

  const totalHeight = headerHeight + chartRect.height;
  const totalWidth = contentWidth;

  // Clone the chart SVG and resolve CSS variables
  const chartSvgClone = chartSvgElement.cloneNode(true) as SVGSVGElement;
  const chartDom = chart.getDom();
  const computedStyle = getComputedStyle(chartDom);
  resolveCssVariables(chartSvgClone, computedStyle);

  // Create standalone SVG for the chart only (no foreignObject)
  const chartOnlySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chartOnlySvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  chartOnlySvg.setAttribute('width', (chartRect.width * SCALE_FACTOR).toString(10));
  chartOnlySvg.setAttribute('height', (chartRect.height * SCALE_FACTOR).toString(10));
  chartOnlySvg.setAttribute('viewBox', `0 0 ${chartRect.width} ${chartRect.height}`);

  // Copy all children from the cloned SVG
  while (chartSvgClone.firstChild) {
    chartOnlySvg.appendChild(chartSvgClone.firstChild);
  }

  // Render chart SVG to image
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(chartOnlySvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = svgUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  // Create the final canvas
  const canvas = document.createElement('canvas');
  canvas.width = totalWidth * SCALE_FACTOR;
  canvas.height = totalHeight * SCALE_FACTOR;

  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    URL.revokeObjectURL(svgUrl);
    return null;
  }

  // Scale context for high resolution
  ctx.scale(SCALE_FACTOR, SCALE_FACTOR);

  // Draw background
  const computedBackgroundColor = computedStyle.getPropertyValue('--ax-bg-neutral-soft').trim();
  const backgroundColor = computedBackgroundColor.length === 0 ? '#ffffff' : computedBackgroundColor;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  let currentY = PADDING;

  // Draw title text directly on canvas
  if (hasTitle && titleElement !== null && titleStyles !== null) {
    const titleText = titleElement.textContent.trim();

    if (titleText.length !== 0) {
      ctx.font = `${titleStyles.fontWeight} ${titleStyles.fontSize} ${titleStyles.fontFamily}`;
      ctx.fillStyle = titleStyles.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(titleText, totalWidth / 2, currentY);
    }

    currentY += titleHeight;

    if (!hasDescription) {
      currentY += PADDING;
    }
  }

  // Draw description text directly on canvas
  if (hasDescription && descriptionElement !== null && descriptionStyles !== null) {
    const descriptionText = descriptionElement.textContent.trim();

    if (descriptionText.length !== 0) {
      ctx.font = `${descriptionStyles.fontWeight} ${descriptionStyles.fontSize} ${descriptionStyles.fontFamily}`;
      ctx.fillStyle = descriptionStyles.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(descriptionText, totalWidth / 2, currentY);
    }

    currentY += descriptionHeight + PADDING;
  }

  // Draw the chart image
  ctx.drawImage(img, 0, currentY, chartRect.width, chartRect.height);

  URL.revokeObjectURL(svgUrl);

  const title = titleElement?.textContent?.trim() ?? 'chart';

  return { canvas, title };
};

const COLOR_ATTRIBUTES = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'];

/**
 * Recursively resolves CSS variables in an SVG element and its children.
 */
const resolveCssVariables = (element: Element, computedStyle: CSSStyleDeclaration): void => {
  // Process inline style attribute
  const style = element.getAttribute('style');
  if (style !== null) {
    element.setAttribute('style', resolveValues(style, computedStyle));
  }

  // Process fill, stroke, and other color attributes
  for (const attr of COLOR_ATTRIBUTES) {
    const value = element.getAttribute(attr);
    if (value?.includes('var(')) {
      element.setAttribute(attr, resolveValues(value, computedStyle));
    }
  }

  // Recursively process children
  for (const child of element.children) {
    resolveCssVariables(child, computedStyle);
  }
};

/**
 * Resolves CSS variables in a string value using computed styles.
 * Replaces var(--property-name) or var(--property-name, fallback) with computed values.
 */
const resolveValues = (value: string, computedStyle: CSSStyleDeclaration): string =>
  value.replace(CSS_VARIABLE_REGEX, (match, varContent: string) => {
    const commaIndex = varContent.indexOf(',');
    const varName = commaIndex === -1 ? varContent.trim() : varContent.slice(0, commaIndex).trim();
    const fallback = commaIndex === -1 ? undefined : varContent.slice(commaIndex + 1).trim();

    const resolved = computedStyle.getPropertyValue(varName).trim();

    if (resolved.length !== 0) {
      return resolved;
    }

    if (fallback !== undefined && fallback.length !== 0) {
      return fallback;
    }

    return match;
  });

const CSS_VARIABLE_REGEX = /var\(([^)]+)\)/g;
