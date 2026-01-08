import { BodyShort, Table } from '@navikt/ds-react';
import {
  type ChartOption,
  extractCategoryRows,
  extractPieRows,
  getCategoryLabels,
  getChartDataType,
  getVisibleSeries,
  normalizeSeries,
  type Series,
} from '@/lib/echarts/chart-data';
import { formatDecimal, formatPercent } from '@/lib/format';

/**
 * Formats a value as a percentage and rounds numbers, if needed
 */
const formatValue = (value: string | number, isPercentage: boolean): string | number => {
  if (typeof value !== 'number') {
    return value;
  }

  if (isPercentage) {
    return formatPercent(value);
  }

  return Math.round(value) === value ? value : formatDecimal(value);
};

interface PieTableProps {
  series: Series[];
  isPercentage: boolean;
  ref?: React.Ref<HTMLTableElement>;
}

/**
 * Renders a pie chart style table (name/value pairs)
 */
const PieTable = ({ series, isPercentage, ref }: PieTableProps) => {
  const rows = extractPieRows(series);

  return (
    <Table size="small" zebraStripes ref={ref}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell align="right">{isPercentage ? 'Prosent' : 'Antall'}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className="whitespace-nowrap font-mono">
        {rows.map((row, index) => (
          <Table.Row key={index}>
            <Table.DataCell>{row.name}</Table.DataCell>
            <Table.DataCell align="right">{formatValue(row.value, isPercentage)}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

interface CategoryTableProps {
  labels: (string | number)[];
  series: Series[];
  isPercentage: boolean;
  ref?: React.Ref<HTMLTableElement>;
}

/**
 * Renders a category-based table (bar/line chart style)
 */
const CategoryTable = ({ labels, series, isPercentage, ref }: CategoryTableProps) => {
  const visibleSeries = getVisibleSeries(series);

  if (visibleSeries.length === 0) {
    return <BodyShort>Ingen data tilgjengelig</BodyShort>;
  }

  const rows = extractCategoryRows(labels, series);

  return (
    <Table size="small" zebraStripes ref={ref}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Kategori</Table.HeaderCell>
          {visibleSeries.map(({ name }, index) => (
            <Table.HeaderCell
              key={name ?? `missing-${index.toString(10)}`}
              align="center"
              className="min-w-32 align-top"
            >
              {name ?? '<Mangler>'}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body className="whitespace-nowrap font-mono">
        {rows.map((row, index) => (
          <Table.Row key={index}>
            <Table.DataCell>{row.label}</Table.DataCell>
            {row.values.map((value, valueIndex) => (
              <Table.DataCell key={valueIndex} align="right">
                {formatValue(value, isPercentage)}
              </Table.DataCell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

interface DataViewTableProps {
  option: ChartOption;
  /** If true, numeric values are treated as decimals and formatted as percentages (e.g., 0.25 → "25,0 %") */
  isPercentage?: boolean;
  ref?: React.Ref<HTMLTableElement>;
}

/**
 * Component for displaying chart data as a table
 */
export const DataViewTable = ({ option, isPercentage = false, ref }: DataViewTableProps) => {
  const series = normalizeSeries(option);

  if (series.length === 0) {
    return <BodyShort>Ingen data tilgjengelig</BodyShort>;
  }

  const dataType = getChartDataType(option);

  if (dataType === 'pie') {
    return <PieTable series={series} isPercentage={isPercentage} ref={ref} />;
  }

  const labels = getCategoryLabels(option);

  return <CategoryTable labels={labels} series={series} isPercentage={isPercentage} ref={ref} />;
};
