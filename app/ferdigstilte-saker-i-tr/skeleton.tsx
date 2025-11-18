import { memo } from 'react';
import { Card } from '@/components/cards';
import { BarChart, Histogram, OtherChart, PieChart } from '@/components/charts/common/skeletonc-components';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const Skeleton = memo(() => (
  <ChartsWrapper>
    <Card span={4}>
      <OtherChart />
    </Card>

    <Card span={4}>
      <BarChart bars={20} />
    </Card>

    <Card>
      <BarChart bars={7} />
    </Card>

    <Card span={5}>
      <BarChart bars={20} />
    </Card>

    <Card span={4}>
      <Histogram />
    </Card>

    <Card>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart bars={20} />
    </Card>
  </ChartsWrapper>
));
