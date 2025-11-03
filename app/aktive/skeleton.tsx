import { memo } from 'react';
import { Card } from '@/components/cards';
import { BarChart, Histogram, PieChart } from '@/components/charts/common/skeletonc-components';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const Skeleton = memo(() => (
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

    <Card fullWidth span={4}>
      <Histogram />
    </Card>
  </ChartsWrapper>
));
