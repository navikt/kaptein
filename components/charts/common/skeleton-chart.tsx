/** biome-ignore-all lint/suspicious/noArrayIndexKey: Only static items */
import { HStack, Skeleton, VStack } from '@navikt/ds-react';
import { Fragment, memo } from 'react';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

const randomPercentage = () => Math.floor(Math.random() * 100);

const randomLegendTextWidth = () => Math.floor(Math.random() * 250) + 50;
const randomTextWidth = () => Math.floor(Math.random() * 50) + 50;

const BarChart = ({ bars = 24 }: { bars?: number }) => (
  <VStack justify="space-between" padding="2" className="h-full">
    <Title />
    <div className="grid w-full grid-cols-[30%_70%] gap-x-2 gap-y-2">
      {new Array(bars).fill(null).map((_, i) => (
        <Fragment key={i}>
          <div className="flex items-center justify-end">
            <Skeleton variant="rectangle" height="10px" width={`${randomPercentage()}%`} />
          </div>

          <Skeleton variant="rectangle" height="25px" width={`${randomPercentage()}%`} />
        </Fragment>
      ))}
    </div>
    <Legend />
  </VStack>
);

export function generateHistogram(count: number): number[] {
  const max = 100;
  const mean = count / 2;
  const stdDev = count / 6;

  return Array.from({ length: count }, (_, i) => {
    const x = i - mean;
    const baseValue = Math.exp(-(x * x) / (2 * stdDev * stdDev));
    const randomFactor = 0.8 + Math.random() * 0.4;

    return Math.min(max, Math.round(max * baseValue * randomFactor));
  });
}

const Histogram = ({ bars = 50 }: { bars?: number }) => (
  <VStack justify="space-between" padding="2" className="h-full gap-4">
    <Title />
    <div className="flex grow items-end justify-start gap-2">
      {generateHistogram(bars).map((height, i) => (
        <Skeleton key={i} variant="rectangle" width="25px" height={`${height}%`} />
      ))}
    </div>
    <Legend />
  </VStack>
);

const Title = () => (
  <div className="flex w-[600px] flex-col items-center self-center">
    <Skeleton variant="text" width={`${randomTextWidth()}%`} height="30px" />
    <Skeleton variant="text" width={`${randomTextWidth()}%`} height="20px" />
  </div>
);

const PieChart = () => (
  <VStack justify="space-between" align="center" className="h-full" padding="2">
    <VStack justify="start" align="center" gap="4">
      <Title />
      <Skeleton variant="circle" width="250px" height="250px" />
    </VStack>
    <Legend />
  </VStack>
);

const Legend = () => (
  <div className="w-full">
    <HStack justify="center" align="start" gap="2">
      {new Array(4).fill(null).map((_, i) => (
        <HStack key={i} gap="1" justify="start" align="center">
          <Skeleton variant="rectangle" width="30px" height="20px" />
          <Skeleton variant="text" width={`${randomLegendTextWidth()}px`} height="20px" />
        </HStack>
      ))}
    </HStack>
  </div>
);

export const SkeletonAktive = memo(() => (
  <ChartsWrapper>
    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card>
      <PieChart />
    </Card>
    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <BarChart bars={6} />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>
  </ChartsWrapper>
));

export const SkeletonFerdigstilte = memo(() => (
  <ChartsWrapper>
    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card>
      <BarChart bars={6} />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart />
    </Card>
  </ChartsWrapper>
));

export const SkeletonSaksstrøm = memo(() => (
  <ChartsWrapper>
    <Card fullWidth span={3}>
      <Histogram />
    </Card>
    <Card fullWidth span={3}>
      <Histogram />
    </Card>
    <Card fullWidth span={4}>
      <Histogram />
    </Card>
  </ChartsWrapper>
));

export const SkeletonBehandlingstid = memo(() => (
  <ChartsWrapper>
    <Card fullWidth span={3}>
      <Histogram />
    </Card>
    <Card fullWidth span={3}>
      <Histogram />
    </Card>
  </ChartsWrapper>
));
