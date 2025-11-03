import { memo } from 'react';
import { Card } from '@/components/cards';
import { Histogram, OtherChart } from '@/components/charts/common/skeletonc-components';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const Skeleton = memo(() => (
  <ChartsWrapper>
    <Card fullWidth span={3}>
      <Histogram />
    </Card>
    <Card fullWidth span={3}>
      <OtherChart />
    </Card>
    <Card fullWidth span={3}>
      <OtherChart />
    </Card>
  </ChartsWrapper>
));
