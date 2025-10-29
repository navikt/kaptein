import { COMMON_PIE_CHART_PROPS } from '@/components/charts/common/common-chart-props';
import { type CommonChartProps, EChart } from '@/lib/echarts/echarts';

interface Serie<D> {
  name?: string;
  color: string | string[];
  data: D[];
  type: string;
  radius?: string;
  stack?: string;
  top?: number | string;
  label?: {
    show?: boolean;
    formatter?: (data: D) => string;
  };
  emphasis?: {
    disabled?: boolean;
    focus?: string;
  };
}

interface PieChartProps<D> extends CommonChartProps {
  series: Serie<D>[];
}

export const PieChart = <D,>({ series, ...rest }: PieChartProps<D>) => (
  <EChart {...rest} option={{ ...COMMON_PIE_CHART_PROPS, series }} />
);
