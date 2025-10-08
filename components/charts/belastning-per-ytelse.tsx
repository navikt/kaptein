'use client';

import { useMemo } from 'react';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, IKodeverkSimpleValue, Ledig, Tildelt } from '@/lib/types';

export type Bucket = { inn: number; ut: number; label: string };
export type Buckets = Record<number, Bucket>;

interface Props {
  title: string;
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdige: (BaseBehandling & (Ledig | Tildelt))[];
  restanseList: (BaseBehandling & (Ledig | Tildelt))[];
  ytelser: IKodeverkSimpleValue[];
}

interface YtelseData {
  ytelseId: string;
  ytelseNavn: string;
  mottatt: number;
  ferdigstilt: number;
  diff: number;
  restanse: number;
}

export const BelastningPerYtelse = ({ title, ferdigstilte, uferdige, restanseList, ytelser }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();

  const ytelseData = useMemo<YtelseData[]>(() => {
    if (fromFilter === null || toFilter === null) {
      return [];
    }

    // Create a map to count mottatt and ferdigstilt per ytelse
    const ytelseMap = new Map<string, { mottatt: number; ferdigstilt: number }>();

    // Count incoming cases
    countMottattInPeriod(uferdige, fromFilter, toFilter, ytelseMap);
    countMottattInPeriod(ferdigstilte, fromFilter, toFilter, ytelseMap);

    // Count completed cases
    countFerdigstiltInPeriod(ferdigstilte, fromFilter, toFilter, ytelseMap);

    // Count unfinished cases per ytelse (outgoing)
    const restanseMap = new Map<string, number>();

    for (const behandling of restanseList) {
      const count = restanseMap.get(behandling.ytelseId) ?? 0;
      restanseMap.set(behandling.ytelseId, count + 1);
    }

    // Convert to array and calculate metrics
    const data: YtelseData[] = [];

    for (const ytelse of ytelser) {
      const counts = ytelseMap.get(ytelse.id);
      if (counts === undefined) {
        continue; // Skip ytelser with no data
      }

      const { mottatt, ferdigstilt } = counts;
      const diff = mottatt - ferdigstilt;
      const restanse = restanseMap.get(ytelse.id) ?? 0;

      data.push({
        ytelseId: ytelse.id,
        ytelseNavn: ytelse.navn,
        mottatt,
        ferdigstilt,
        diff,
        restanse,
      });
    }

    return data;
  }, [ferdigstilte, uferdige, ytelser, fromFilter, toFilter, restanseList]);

  const labels = useMemo(() => ytelseData.map((d) => d.ytelseNavn), [ytelseData]);
  const mottattData = useMemo(() => ytelseData.map(({ mottatt }) => mottatt), [ytelseData]);
  const restanseData = useMemo(
    () => ytelseData.map(({ diff, restanse }) => (diff > 0 ? Math.max(restanse - diff, 0) : restanse)),
    [ytelseData],
  );

  const positiveDiff = useMemo(() => ytelseData.map((d) => (d.diff <= 0 ? 0 : d.diff)), [ytelseData]);
  const negativeDiff = useMemo(() => ytelseData.map((d) => (d.diff >= 0 ? 0 : Math.abs(d.diff))), [ytelseData]);

  const totalMottatt = useMemo(() => ytelseData.reduce((sum, d) => sum + d.mottatt, 0), [ytelseData]);
  const totalFerdigstilt = useMemo(() => ytelseData.reduce((sum, d) => sum + d.ferdigstilt, 0), [ytelseData]);
  const totalDiff = useMemo(() => totalMottatt - totalFerdigstilt, [totalMottatt, totalFerdigstilt]);

  if (ytelseData.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={`Mottatt: ${totalMottatt}, ferdigstilt: ${totalFerdigstilt}, restanse endring: ${numberWithSign(totalDiff)}`}
      option={{
        grid: { left: 200, right: 100 },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            if (!Array.isArray(params) || params.length === 0) {
              return '';
            }

            const { dataIndex } = params[0];

            const ytelse = ytelseData[dataIndex];

            if (ytelse === undefined) {
              return '';
            }

            return getTooltip(ytelse);
          },
        },
        yAxis: {
          type: 'category',
          data: labels,
        },
        xAxis: {
          type: 'value',
          name: 'Antall saker',
        },
        legend: {
          data: ['Mottatt', 'Differanse +', 'Differanse -', 'Inngående restanse'],
          bottom: 0,
        },
        series: [
          {
            id: 'mottatt',
            name: 'Mottatt',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: 'var(--ax-accent-500)',
            },
            emphasis: { disabled: true },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: { value: number }) => {
                return params.value > 0 ? `${params.value}` : '';
              },
            },
            data: mottattData,
          },
          {
            id: 'restanse',
            name: 'Inngående restanse',
            type: 'bar',
            stack: 'restanse',
            itemStyle: {
              color: 'var(--ax-meta-purple-500)',
            },
            emphasis: { disabled: true },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: { value: number }) => {
                return params.value > 0 ? params.value : '';
              },
            },
            data: restanseData,
          },
          {
            id: 'restanse-plus',
            name: 'Differanse +',
            type: 'bar',
            stack: 'restanse',
            itemStyle: {
              color: 'var(--ax-danger-500)',
            },
            emphasis: { disabled: true },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: { value: number }) => {
                return params.value > 0 ? params.value : '';
              },
            },
            data: positiveDiff,
          },
          {
            id: 'restanse-minus',
            name: 'Differanse -',
            type: 'bar',
            stack: 'restanse',
            itemStyle: {
              color: {
                type: 'pattern',
                image: createStripeSvg(),
                repeat: 'repeat',
              },
            },
            emphasis: { disabled: true },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: { value: number }) => {
                return params.value > 0 ? params.value : '';
              },
            },
            data: negativeDiff,
          },
        ],
      }}
    />
  );
};

const numberWithSign = (n: number): string => `${sign(n)}${Math.abs(n)}`;

const sign = (n: number): string => {
  if (n > 0) {
    return '+';
  }
  if (n < 0) {
    return '-';
  }
  return '';
};

const countMottattInPeriod = (
  behandlinger: BaseBehandling[],
  fromFilter: string,
  toFilter: string,
  ytelseMap: Map<string, { mottatt: number; ferdigstilt: number }>,
) => {
  for (const b of behandlinger) {
    if (b.mottattKlageinstans >= fromFilter && b.mottattKlageinstans <= toFilter) {
      const existing = ytelseMap.get(b.ytelseId) ?? { mottatt: 0, ferdigstilt: 0 };
      ytelseMap.set(b.ytelseId, { ...existing, mottatt: existing.mottatt + 1 });
    }
  }
};

const countFerdigstiltInPeriod = (
  ferdigstilte: (BaseBehandling & Ferdigstilt)[],
  fromFilter: string,
  toFilter: string,
  ytelseMap: Map<string, { mottatt: number; ferdigstilt: number }>,
) => {
  for (const b of ferdigstilte) {
    if (b.avsluttetAvSaksbehandlerDate >= fromFilter && b.avsluttetAvSaksbehandlerDate <= toFilter) {
      const existing = ytelseMap.get(b.ytelseId) ?? { mottatt: 0, ferdigstilt: 0 };
      ytelseMap.set(b.ytelseId, { ...existing, ferdigstilt: existing.ferdigstilt + 1 });
    }
  }
};

const createStripeSvg = (): string => {
  const computedStyle = getComputedStyle(document.documentElement);
  const fillColor = computedStyle.getPropertyValue('--ax-meta-purple-500').trim();
  const strokeColor = computedStyle.getPropertyValue('--ax-success-700').trim();

  const svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="10" fill="${fillColor}"/>
    <path d="M 0 10 L 10 0 M -2.5 2.5 L 2.5 -2.5 M 7.5 12.5 L 12.5 7.5" stroke="${strokeColor}" stroke-width="4"/>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const getTooltip = ({ ytelseNavn, mottatt, ferdigstilt, diff, restanse }: YtelseData): string =>
  `
<strong>${ytelseNavn}</strong><br/>
<table>
  <tbody>
    <tr>
      <td class="pr-1">Mottatt:</td>
      <td>${mottatt} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Ferdigstilt:</td>
      <td>${ferdigstilt} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Differanse:</td>
      <td>${diffText(diff)} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Inngående restanse:</td>
      <td>${restanse - diff} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Utgående restanse:</td>
      <td>${restanse} saker</td>
    </tr>
  </tbody>
</table>
`.trim();

const diffText = (n: number): string => {
  const color = n > 0 ? 'var(--ax-text-danger)' : 'var(--ax-text-success)';
  return `<span style="color: ${color};">${numberWithSign(n)}</span>`;
};
