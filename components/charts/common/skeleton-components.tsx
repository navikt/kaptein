/** biome-ignore-all lint/suspicious/noArrayIndexKey: Only static items */
import { HStack, Skeleton, VStack } from '@navikt/ds-react';
import { Fragment } from 'react';

// Deterministic pseudo-random functions to avoid hydration mismatches
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const seededPercentage = (seed: number) => Math.floor(seededRandom(seed) * 100);

const seededLegendTextWidth = (seed: number) => Math.floor(seededRandom(seed) * 250) + 50;
const seededTextWidth = (seed: number) => Math.floor(seededRandom(seed) * 50) + 50;

export const BarChart = ({ bars = 20 }: { bars?: number }) => (
  <VStack justify="space-between" padding="space-8" className="h-full">
    <Title />
    <div className="grid w-full grid-cols-[300px_auto] gap-x-2 gap-y-2">
      {Array.from({ length: bars })
        .fill(null)
        .map((_, i) => (
          <Fragment key={i}>
            <div className="flex items-center justify-end">
              <Skeleton variant="rectangle" height="10px" width={`${seededPercentage(i)}%`} />
            </div>

            <Skeleton variant="rectangle" height="25px" width={`${seededPercentage(i + 1000)}%`} />
          </Fragment>
        ))}
    </div>
    <Legend />
  </VStack>
);

const generateHistogram = (count: number): number[] => {
  const max = 100;
  const mean = count / 2;
  const stdDev = count / 6;

  return Array.from({ length: count }, (_, i) => {
    const x = i - mean;
    const baseValue = Math.exp(-(x * x) / (2 * stdDev * stdDev));
    const randomFactor = 0.8 + seededRandom(i) * 0.4;

    return Math.min(max, Math.round(max * baseValue * randomFactor));
  });
};

export const Histogram = ({ bars = 50 }: { bars?: number }) => (
  <VStack justify="space-between" padding="space-8" className="h-full gap-4">
    <Title />
    <div className="flex grow items-end justify-start gap-2">
      {generateHistogram(bars).map((height, i) => (
        <Skeleton key={i} variant="rectangle" width="20px" height={`${height}%`} />
      ))}
    </div>
    <Legend />
  </VStack>
);

const Title = () => (
  <div className="flex w-150 flex-col items-center self-center">
    <Skeleton variant="text" width={`${seededTextWidth(1)}%`} height="30px" />
    <Skeleton variant="text" width={`${seededTextWidth(2)}%`} height="20px" />
  </div>
);

export const PieChart = () => (
  <VStack justify="space-between" align="center" className="h-full" padding="space-8">
    <VStack justify="start" align="center" gap="space-16">
      <Title />
      <Skeleton variant="circle" width="250px" height="250px" />
    </VStack>
    <Legend />
  </VStack>
);

const Legend = () => (
  <div className="w-full">
    <HStack justify="center" align="start" gap="space-8">
      {Array.from({ length: 4 })
        .fill(null)
        .map((_, i) => (
          <HStack key={i} gap="space-4" justify="start" align="center">
            <Skeleton variant="rectangle" width="30px" height="20px" />
            <Skeleton variant="text" width={`${seededLegendTextWidth(i)}px`} height="20px" />
          </HStack>
        ))}
    </HStack>
  </div>
);

export const OtherChart = () => (
  <VStack className="h-full" gap="space-32">
    <Title />
    <div className="grow">
      <Skeleton variant="rectangle" width="100%" height="100%" />
    </div>
    <Legend />
  </VStack>
);
