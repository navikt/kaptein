import { memo } from 'react';
import { Card } from '@/components/cards';
import { BarChart, Histogram, PieChart } from '@/components/charts/common/skeletonc-components';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const Skeleton = memo(() => (
  <ChartsWrapper>
    <Card span={3}>
      <BarChart bars={15} />
    </Card>

    <Card span={4}>
      <BarChart bars={20} />
    </Card>

    <Card span={4}>
      <Histogram />
    </Card>

    <Card span={2}>
      <PieChart />
    </Card>

    <Card span={4}>
      <BarChart bars={20} />
    </Card>
  </ChartsWrapper>
));
