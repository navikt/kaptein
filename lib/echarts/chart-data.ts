import type { ECBasicOption } from 'echarts/types/dist/shared';

interface SeriesData {
  name?: string;
  value?: number | string;
}

export type SeriesDataItem = number | string | SeriesData | null | undefined;

export interface Series {
  name?: string;
  data?: SeriesDataItem[];
  type?: string;
}

export interface AxisData {
  data?: (string | number)[];
}

export interface ChartOption extends ECBasicOption {
  series?: Series | Series[];
  xAxis?: AxisData | AxisData[];
  yAxis?: AxisData | AxisData[];
}

/**
 * Extracts category labels from xAxis or yAxis
 */
export const getCategoryLabels = (option: ChartOption): (string | number)[] => {
  const xAxis = Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis;
  const yAxis = Array.isArray(option.yAxis) ? option.yAxis[0] : option.yAxis;

  return xAxis?.data ?? yAxis?.data ?? [];
};

/**
 * Normalizes series to always be an array
 */
export const normalizeSeries = (option: ChartOption): Series[] => {
  if (!option.series) {
    return [];
  }

  return Array.isArray(option.series) ? option.series : [option.series];
};

/**
 * Checks if series data is in {name, value} format (pie chart style)
 */
const isNameValueData = (data: Series['data']): data is SeriesData[] => {
  if (data === null || data === undefined || data.length === 0) {
    return false;
  }

  const firstItem = data[0];

  return typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem;
};

/**
 * Filters series to only include those with valid data.
 * Series without names are assigned default names "Verdi 1", "Verdi 2", etc.
 */
export const getVisibleSeries = (series: Series[]): Series[] => {
  const seriesWithData = series.filter(({ data }) => data !== null && data !== undefined && data.length > 0);

  // Assign default names to series without names
  return seriesWithData.map((s, index) => {
    if (s.name === undefined) {
      return { ...s, name: `Verdi ${index + 1}` };
    }
    return s;
  });
};

/**
 * Gets the display value from a series data item
 */
const getDisplayValue = (value: SeriesDataItem): string | number => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return value.value ?? '';
  }

  return value;
};

interface PieRow {
  name: string;
  value: string | number;
}

/**
 * Extracts pie chart style rows from series data
 */
export const extractPieRows = (series: Series[]): PieRow[] => {
  const rows: PieRow[] = [];

  for (const { data } of series) {
    if (data === null || data === undefined || !isNameValueData(data)) {
      continue;
    }

    for (const item of data) {
      rows.push({
        name: item.name ?? '',
        value: item.value ?? '',
      });
    }
  }

  return rows;
};

interface CategoryRow {
  label: string | number;
  values: (string | number)[];
}

/**
 * Extracts category-based rows from series data
 */
export const extractCategoryRows = (labels: (string | number)[], series: Series[]): CategoryRow[] => {
  const visibleSeries = getVisibleSeries(series);

  return labels.map((label, index) => ({
    label,
    values: visibleSeries.map(({ data }) => getDisplayValue(data?.[index])),
  }));
};

type ChartDataType = 'pie' | 'category';

/**
 * Determines the type of chart data
 */
export const getChartDataType = (option: ChartOption): ChartDataType => {
  const series = normalizeSeries(option);

  if (series.length === 0) {
    return 'pie';
  }

  const firstSeries = series[0];

  if (firstSeries?.type === 'pie' || isNameValueData(firstSeries?.data)) {
    return 'pie';
  }

  const labels = getCategoryLabels(option);

  if (labels.length === 0) {
    return 'pie';
  }

  return 'category';
};
