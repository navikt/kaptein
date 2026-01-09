import type { ECharts } from 'echarts/core';

interface RenderChartResult {
  canvas: HTMLCanvasElement;
  title: string;
}

const SCALE_FACTOR = 3; // 3x resolution for high quality
const PADDING = 20;

/**
 * Renders an ECharts chart to a canvas element.
 * Combines title, description, and chart into a single SVG, then renders to canvas.
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

  // Calculate dimensions
  const contentWidth = chartRect.width;
  const titleHeight = hasTitle ? titleRect.height : 0;
  const descriptionHeight = hasDescription ? descriptionRect.height : 0;
  const headerHeight =
    PADDING + titleHeight + (hasDescription ? descriptionHeight : 0) + (hasTitle || hasDescription ? PADDING : 0);

  const totalHeight = headerHeight + chartRect.height;
  const totalWidth = contentWidth;

  // Create combined SVG
  const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  combinedSvg.setAttribute('width', (totalWidth * SCALE_FACTOR).toString(10));
  combinedSvg.setAttribute('height', (totalHeight * SCALE_FACTOR).toString(10));
  combinedSvg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

  // Add background
  const chartDom = chart.getDom();
  const computedBackgroundColor = getComputedStyle(chartDom).getPropertyValue('--ax-bg-neutral-soft').trim();
  const backgroundColor = computedBackgroundColor.length === 0 ? '#ffffff' : computedBackgroundColor;

  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', '100%');
  bgRect.setAttribute('height', '100%');
  bgRect.setAttribute('fill', backgroundColor);
  combinedSvg.appendChild(bgRect);

  let currentY = PADDING;

  // Add title via foreignObject
  if (hasTitle && titleElement instanceof HTMLElement) {
    const titleForeignObject = createForeignObject(titleElement, titleRect.height, currentY);
    combinedSvg.appendChild(titleForeignObject);
    currentY += titleHeight;

    if (!hasDescription) {
      currentY += PADDING;
    }
  }

  // Add description via foreignObject
  if (hasDescription && descriptionElement instanceof HTMLElement) {
    const descriptionForeignObject = createForeignObject(descriptionElement, descriptionRect.height, currentY);
    combinedSvg.appendChild(descriptionForeignObject);
    currentY += descriptionHeight + PADDING;
  }

  // Clone and add chart SVG
  const chartSvgClone = chartSvgElement.cloneNode(true) as SVGSVGElement;

  // Resolve CSS variables in the chart SVG
  const computedStyle = getComputedStyle(chartDom);
  resolveCssVariables(chartSvgClone, computedStyle);

  // Wrap chart in a group with translation
  const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  chartGroup.setAttribute('transform', `translate(0, ${currentY})`);

  // Copy all children from the cloned SVG to the group
  while (chartSvgClone.firstChild) {
    chartGroup.appendChild(chartSvgClone.firstChild);
  }

  combinedSvg.appendChild(chartGroup);

  // Render combined SVG to canvas
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(combinedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = svgUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth * SCALE_FACTOR;
  canvas.height = totalHeight * SCALE_FACTOR;

  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    URL.revokeObjectURL(svgUrl);
    return null;
  }

  ctx.drawImage(img, 0, 0);

  URL.revokeObjectURL(svgUrl);

  const title = titleElement?.textContent?.trim() ?? 'chart';

  return { canvas, title };
};

/**
 * Creates a foreignObject element containing a cloned HTML element with inlined styles.
 */
const createForeignObject = (element: HTMLElement, height: number, y: number): SVGForeignObjectElement => {
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('x', '0');
  foreignObject.setAttribute('y', y.toString(10));
  foreignObject.setAttribute('width', '100%');
  foreignObject.setAttribute('height', height.toString(10));

  const clone = element.cloneNode(true) as HTMLElement;
  inlineComputedStyles(element, clone);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  clone.style.width = '100%';
  clone.style.textAlign = 'center';

  foreignObject.appendChild(clone);

  return foreignObject;
};

// Key style properties to inline for text rendering
const TEXT_STYLE_PROPERTIES = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'color',
  'text-align',
  'line-height',
  'letter-spacing',
  'text-decoration',
  'text-transform',
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'gap',
  'padding',
  'margin',
  'box-sizing',
  'white-space',
];

/**
 * Recursively inlines computed styles from the source element to the clone.
 * This ensures the clone renders identically when embedded in SVG foreignObject.
 */
const inlineComputedStyles = (source: Element, clone: Element): void => {
  if (source instanceof HTMLElement && clone instanceof HTMLElement) {
    const computedStyle = getComputedStyle(source);

    const inlineStyles: string[] = [];

    for (const prop of TEXT_STYLE_PROPERTIES) {
      const value = computedStyle.getPropertyValue(prop).trim();

      if (value.length !== 0) {
        inlineStyles.push(`${prop}: ${value}`);
      }
    }

    // Append to existing inline styles
    const existingStyle = clone.getAttribute('style')?.trim();

    clone.setAttribute(
      'style',
      (existingStyle !== undefined && existingStyle.length !== 0
        ? [existingStyle, ...inlineStyles]
        : inlineStyles
      ).join('; '),
    );
  }

  // Recursively process children
  const sourceChildren = source.children;
  const cloneChildren = clone.children;

  for (let i = 0; i < sourceChildren.length && i < cloneChildren.length; i++) {
    const sourceChild = sourceChildren[i];
    const cloneChild = cloneChildren[i];

    if (sourceChild !== undefined && cloneChild !== undefined) {
      inlineComputedStyles(sourceChild, cloneChild);
    }
  }
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
