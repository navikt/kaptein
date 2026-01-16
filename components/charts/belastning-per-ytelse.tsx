'use client';

import { type ReactNode, useMemo } from 'react';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
import { NoData } from '@/components/no-data/no-data';
import { DiffNumber, diffNumberHtml } from '@/components/numbers/diff-number';
import { EChart } from '@/lib/echarts/echarts';
import type { Avsluttet, BaseBehandling, IKodeverkSimpleValue, Ledig, Tildelt } from '@/lib/types';

export type Bucket = { inn: number; ut: number; label: string };
export type Buckets = Record<number, Bucket>;

interface Props {
  title: string;
  helpText: ReactNode;
  ferdigstilteInPeriod: (BaseBehandling & Avsluttet)[];
  mottattInPeriod: (BaseBehandling & (Ledig | Tildelt))[];
  outgoingRestanse: BaseBehandling[];
  ytelser: IKodeverkSimpleValue[];
}

interface YtelseData {
  entryId: string;
  ytelseNavn: string;
  mottatt: number;
  ferdigstilt: number;
  diff: number;
  restanse: number;
}

export const BelastningPerYtelse = ({
  title,
  ferdigstilteInPeriod,
  mottattInPeriod,
  outgoingRestanse,
  ytelser,
  helpText,
}: Props) => {
  const { fromFilter, toFilter } = useDateFilter();

  // Combine all behandlinger for useYtelseChartData
  const allBehandlinger = useMemo(
    () => [...mottattInPeriod, ...ferdigstilteInPeriod],
    [mottattInPeriod, ferdigstilteInPeriod],
  );

  const entries = useYtelseChartData(allBehandlinger, ytelser);

  const ytelseData = useMemo<YtelseData[]>(() => {
    const data: YtelseData[] = [];

    for (const entry of entries) {
      const ytelseIds = getYtelseIdsForEntry(entry);

      // Count mottatt from both mottattInPeriod and ferdigstilteInPeriod
      const mottattFromActive = countMottatt(mottattInPeriod, ytelseIds, fromFilter, toFilter);
      const mottattFromFerdigstilte = countMottatt(ferdigstilteInPeriod, ytelseIds, fromFilter, toFilter);
      const mottatt = mottattFromActive + mottattFromFerdigstilte;

      // Count ferdigstilt
      const ferdigstilt = countFerdigstilt(ferdigstilteInPeriod, ytelseIds, fromFilter, toFilter);

      // Count restanse
      const restanse = countRestanse(outgoingRestanse, ytelseIds);

      const diff = mottatt - ferdigstilt;

      // Only include entries with data
      if (mottatt > 0 || ferdigstilt > 0 || restanse > 0) {
        data.push({
          entryId: entry.id,
          ytelseNavn: entry.navn,
          mottatt,
          ferdigstilt,
          diff,
          restanse,
        });
      }
    }

    return data;
  }, [entries, ferdigstilteInPeriod, mottattInPeriod, outgoingRestanse, fromFilter, toFilter]);

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
      description={
        <>
          <strong>Mottatt:</strong> {totalMottatt}. <strong>Ferdigstilt:</strong> {totalFerdigstilt}.{' '}
          <strong>Endring i restanse:</strong> <DiffNumber>{totalDiff}</DiffNumber>.
        </>
      }
      helpText={helpText}
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
          data: ['Mottatt', 'Differanse +', 'Differanse -', 'Restanse ved periodestart'],
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
            name: 'Restanse ved periodestart',
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

/**
 * Count mottatt for a list of ytelseIds
 */
const countMottatt = (
  behandlinger: BaseBehandling[],
  ytelseIds: string[],
  fromFilter: string,
  toFilter: string,
): number =>
  behandlinger.reduce((acc, b) => {
    if (ytelseIds.includes(b.ytelseId) && b.mottattKlageinstans >= fromFilter && b.mottattKlageinstans <= toFilter) {
      return acc + 1;
    }
    return acc;
  }, 0);

/**
 * Count ferdigstilt for a list of ytelseIds
 */
const countFerdigstilt = (
  ferdigstilte: (BaseBehandling & Avsluttet)[],
  ytelseIds: string[],
  fromFilter: string,
  toFilter: string,
): number =>
  ferdigstilte.reduce((acc, b) => {
    if (
      ytelseIds.includes(b.ytelseId) &&
      b.avsluttetAvSaksbehandlerDate >= fromFilter &&
      b.avsluttetAvSaksbehandlerDate <= toFilter
    ) {
      return acc + 1;
    }
    return acc;
  }, 0);

/**
 * Count restanse for a list of ytelseIds
 */
const countRestanse = (outgoingRestanse: BaseBehandling[], ytelseIds: string[]): number =>
  outgoingRestanse.reduce((acc, b) => {
    if (ytelseIds.includes(b.ytelseId)) {
      return acc + 1;
    }
    return acc;
  }, 0);

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
      <td>${diffNumberHtml(diff)} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Restanse ved periodestart:</td>
      <td>${restanse - diff} saker</td>
    </tr>
    <tr>
      <td class="pr-1">Restanse ved periodeslutt:</td>
      <td>${restanse} saker</td>
    </tr>
  </tbody>
</table>
`.trim();
