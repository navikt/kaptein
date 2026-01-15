import { memo } from 'react';
import { Card } from '@/components/cards';
import { BarChart, OtherChart } from '@/components/charts/common/skeleton-components';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const SkeletonSaksstrøm = memo(() => (
  <ChartsWrapper>
    <Card fullWidth span={5}>
      <BarChart bars={25} />
    </Card>
    <Card fullWidth span={3}>
      <OtherChart />
    </Card>
    <Card fullWidth span={3}>
      <OtherChart />
    </Card>
    <Card fullWidth span={3}>
      <OtherChart />
    </Card>
  </ChartsWrapper>
));
