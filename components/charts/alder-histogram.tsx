'use client';

import { VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
}

const TITLE = 'Aldersfordeling (uker)';

interface AgeData {
  weeks: number[];
  counts: number[];
  total: number;
}

export const AlderHistogram = ({ behandlinger }: Props) => {
  const { weeks, counts, total } = useMemo<AgeData>(() => {
    const agesInWeeks = behandlinger.map(({ ageKA }) => Math.floor(ageKA / 7));

    if (agesInWeeks.length === 0) {
      return { weeks: [], counts: [], total: 0 };
    }

    const maxWeek = Math.max(...agesInWeeks);
    const countsArr = Array.from({ length: maxWeek + 1 }, () => 0);

    for (const w of agesInWeeks) {
      if (countsArr[w] !== undefined) {
        countsArr[w] += 1;
      }
    }

    return {
      weeks: countsArr.map((_, i) => i),
      counts: countsArr,
      total: agesInWeeks.length,
    };
  }, [behandlinger]);

  if (counts.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <VStack justify="center" align="center" gap="4" className="h-full w-full">
      <EChart
        height="auto"
        className="w-full grow"
        option={{
          title: {
            text: TITLE,
            subtext: `Viser data for ${total} saker`,
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: { axisValue: number; data: number }[]) => {
              const p = params[0];
              return `Uke ${p?.axisValue ?? '?'}<br/>Antall: ${p?.data ?? '0'}`;
            },
          },
          grid: { top: 60, left: 60, right: 20, bottom: 50 },
          xAxis: {
            type: 'category',
            name: 'Uker',
            nameLocation: 'middle',
            nameGap: 30,
            data: weeks,
            axisLabel: {
              interval: weeks.length > 60 ? Math.ceil(weeks.length / 30) : 0,
              rotate: 0,
            },
          },
          yAxis: {
            type: 'value',
            name: 'Antall',
          },
          series: [
            {
              type: 'bar',
              name: 'Antall',
              data: counts,
              itemStyle: {
                color: '#2B74C7',
              },
              emphasis: {
                itemStyle: {
                  color: '#1E5591',
                },
              },
            },
          ],
        }}
      />
    </VStack>
  );
};
