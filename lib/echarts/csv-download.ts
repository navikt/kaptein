import {
  type ChartOption,
  extractCategoryRows,
  extractPieRows,
  getCategoryLabels,
  getChartDataType,
  getVisibleSeries,
  normalizeSeries,
} from '@/lib/echarts/chart-data';
import { formatFileName } from '@/lib/format';

const DELIMITER = ';'; // Excel requires semicolon as delimiter for CSV.
const DOUBLE_QUOTE_REGEX = /"/g;

/**
 * Escapes a value for CSV format
 */
const escapeCsvValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = typeof value === 'number' ? value.toString(10) : value;

  // If the value contains double quote, escape quotes
  if (stringValue.includes('"')) {
    return `"${stringValue.replace(DOUBLE_QUOTE_REGEX, '""')}"`;
  }

  // If the value contains semicolon, or newline, wrap in quotes
  if (stringValue.includes(DELIMITER) || stringValue.includes('\n')) {
    return `"${stringValue}"`;
  }

  return stringValue;
};

const PIE_HEADER = `Navn${DELIMITER}Verdi`;

/**
 * Generates CSV content for pie chart style data (name/value pairs)
 */
const generatePieCsv = (series: ReturnType<typeof normalizeSeries>): string | null => {
  const rows = extractPieRows(series);

  if (rows.length === 0) {
    return null;
  }

  const csvRows: string[] = [];

  // Header
  csvRows.push(PIE_HEADER);

  // Data rows
  for (const row of rows) {
    csvRows.push(`${escapeCsvValue(row.name)}${DELIMITER}${escapeCsvValue(row.value)}`);
  }

  return csvRows.join('\n');
};

/**
 * Generates CSV content for category-based data (bar/line chart style)
 */
const generateCategoryCsv = (
  labels: (string | number)[],
  series: ReturnType<typeof normalizeSeries>,
): string | null => {
  const visibleSeries = getVisibleSeries(series);

  if (visibleSeries.length === 0) {
    return null;
  }

  const rows = extractCategoryRows(labels, series);
  const csvRows: string[] = [];

  // Header
  const headerCells = ['Kategori', ...visibleSeries.map(({ name }) => escapeCsvValue(name))];
  csvRows.push(headerCells.join(DELIMITER));

  // Data rows
  for (const row of rows) {
    const rowCells = [escapeCsvValue(row.label), ...row.values.map((value) => escapeCsvValue(value))];
    csvRows.push(rowCells.join(DELIMITER));
  }

  return csvRows.join('\n');
};

/**
 * Generates CSV content from chart option
 */
const generateCsvContent = (option: ChartOption): string | null => {
  const series = normalizeSeries(option);

  if (series.length === 0) {
    return null;
  }

  const dataType = getChartDataType(option);

  if (dataType === 'pie') {
    return generatePieCsv(series);
  }

  const labels = getCategoryLabels(option);

  return generateCategoryCsv(labels, series);
};

/**
 * Triggers a download of the CSV file
 */
const downloadCsv = (csvContent: string, filename: string): void => {
  // Add BOM for UTF-8 to ensure proper encoding in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

interface DownloadOptions {
  fromDate: string;
  toDate: string;
}

/**
 * Generates and downloads CSV from chart option
 */
export const downloadChartDataAsCsv = (option: ChartOption, title: string, options: DownloadOptions): void => {
  const csvContent = generateCsvContent(option);

  if (csvContent === null) {
    return;
  }

  downloadCsv(csvContent, formatFileName(title, 'csv', options));
};
