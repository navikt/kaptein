'use client';

import { BodyLong } from '@navikt/ds-react';
import { eachDayOfInterval, eachMonthOfInterval, format, parse } from 'date-fns';
import type { LineSeriesOption } from 'echarts/charts';
import type { XAXisOption } from 'echarts/types/dist/shared';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { getRestanseAfterDate } from '@/components/charts/common/use-data';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { DiffNumber } from '@/components/numbers/diff-number';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { YTELSE_COLOR_MAP } from '@/lib/echarts/color-token';
import { EChart } from '@/lib/echarts/echarts';
import type { Avsluttet, BaseBehandling, IKodeverkSimpleValue, Ledig, Tildelt } from '@/lib/types';

interface CommonProps {
  ferdigstilte: (BaseBehandling & Avsluttet)[];
  uferdige: (BaseBehandling & (Ledig | Tildelt))[];
  ytelser: IKodeverkSimpleValue[];
}

interface ConsumerProps {
  title: string;
}

interface RestanseOverTidProps extends ConsumerProps, CommonProps {
  axisLabel?: XAXisOption['axisLabel'];
  markLine?: LineSeriesOption['markLine'];
}

const DEFAULT_AXIS_LABEL: XAXisOption['axisLabel'] = { rotate: 45 };

const useRestanseOverTidData = ({ ferdigstilte, uferdige, ytelser }: CommonProps) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { days, ytelseSeriesData } = useMemo(() => {
    const from = parse(fromFilter, ISO_DATE_FORMAT, new Date());
    const to = parse(toFilter, ISO_DATE_FORMAT, new Date());

    const ytelseMap = new Map(ytelser.map((ytelse) => [ytelse.id, ytelse]));

    const days = eachDayOfInterval({ start: from, end: to }).map((d) => format(d, ISO_DATE_FORMAT));

    const restansePerDayPerYtelse = calculateRestansePerDayPerYtelse(days, uferdige, ferdigstilte, ytelser);

    const ytelseSeriesData = calculateYtelseTimeSeries(ytelseMap, restansePerDayPerYtelse);

    return {
      days,
      ytelseSeriesData,
    };
  }, [ferdigstilte, uferdige, fromFilter, toFilter, ytelser]);

  const { startRestanse, endRestanse } = useMemo(() => {
    if (ytelseSeriesData.length === 0) {
      return { startRestanse: 0, endRestanse: 0 };
    }

    let endRestanse = 0;
    let startRestanse = 0;

    // Sum up the latest restanse value for each ytelse
    for (const { restanseOverTime } of ytelseSeriesData) {
      endRestanse += restanseOverTime.at(-1) ?? 0;
      startRestanse += restanseOverTime[0] ?? 0;
    }

    return { startRestanse, endRestanse };
  }, [ytelseSeriesData]);

  return { days, ytelseSeriesData, startRestanse, endRestanse };
};

const RestanseOverTidCommon = ({ title, axisLabel = DEFAULT_AXIS_LABEL, markLine, ...props }: RestanseOverTidProps) => {
  const { days, ytelseSeriesData, startRestanse, endRestanse } = useRestanseOverTidData(props);

  if (days.length === 0 || ytelseSeriesData.length === 0) {
    return <NoData title={title} />;
  }

  const diff = endRestanse - startRestanse;

  return (
    <EChart
      title={title}
      description={
        <>
          <strong>Restanse ved periodestart:</strong> {startRestanse} <strong>Restanse ved periodeslutt:</strong>{' '}
          {endRestanse} <strong>Endring:</strong> <DiffNumber>{diff}</DiffNumber>.
        </>
      }
      helpText={<RestanseOverTidHelpText />}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        legend: {
          bottom: 60,
          type: 'scroll',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: true,
            label: {
              precision: '0', // Prevent showing decimals in axis tooltip
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'Antall saker',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: days,
          axisLabel,
        },
        series: ytelseSeriesData.map(({ ytelseId, ytelseNavn, restanseOverTime }, index) => ({
          id: ytelseId,
          name: ytelseNavn,
          type: 'line',
          smooth: false,
          stack: 'total',
          stackOrder: 'seriesDesc',
          symbol: 'none',
          data: restanseOverTime,
          itemStyle: {
            color: `var(--ax-${YTELSE_COLOR_MAP[ytelseId]})`, // Must be set for the tooltip colors to match area color
          },
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            color: `var(--ax-${YTELSE_COLOR_MAP[ytelseId]})`,
            opacity: 1,
          },
          emphasis: {
            focus: 'series',
          },
          // echarts renders markLine once per series it's set on, so only set it on one series
          markLine: index === 0 ? markLine : undefined,
        })),
      }}
    />
  );
};

const calculateRestansePerDayPerYtelse = (
  days: string[],
  uferdige: (BaseBehandling & (Ledig | Tildelt))[],
  ferdigstilte: (BaseBehandling & Avsluttet)[],
  ytelser: IKodeverkSimpleValue[],
) => {
  const restanseMap = new Map<string, Map<string, number>>();

  for (const day of days) {
    const dayBucket = new Map<string, number>();

    // Ensure all days have an entry for all ytelser, even if 0
    for (const ytelse of ytelser) {
      dayBucket.set(ytelse.id, 0);
    }

    // Get all cases that were uncompleted or completed after this day
    const restanseAfterDay = getRestanseAfterDate(uferdige, ferdigstilte, day);

    // Count restanse per ytelse
    for (const sak of restanseAfterDay) {
      const diff = dayBucket.get(sak.ytelseId) ?? 0;
      dayBucket.set(sak.ytelseId, diff + 1);
    }

    restanseMap.set(day, dayBucket);
  }

  return restanseMap;
};

interface YtelseTimeSeries {
  ytelseId: string;
  ytelseNavn: string;
  restanseOverTime: number[];
}

const calculateYtelseTimeSeries = (
  ytelseMap: Map<string, IKodeverkSimpleValue>,
  restansePerDayPerYtelse: Map<string, Map<string, number>>,
): YtelseTimeSeries[] => {
  const ytelseData = new Map<string, YtelseTimeSeries>();

  // Transpose the map to be per ytelse instead of per day
  // restansePerDayPerYtelse is sorted by day due to how it was constructed
  for (const ytelser of restansePerDayPerYtelse.values()) {
    for (const [ytelseId, restanse] of ytelser) {
      const data = ytelseData.get(ytelseId);

      if (data === undefined) {
        const ytelseNavn = ytelseMap.get(ytelseId)?.navn ?? 'Ukjent';
        ytelseData.set(ytelseId, { ytelseId, ytelseNavn, restanseOverTime: [restanse] });
      } else {
        data.restanseOverTime.push(restanse);
      }
    }
  }

  return ytelseData
    .values()
    .filter((r) => r.restanseOverTime.some((v) => v > 0))
    .toArray()
    .toSorted((a, b) => a.ytelseNavn.localeCompare(b.ytelseNavn, 'nb'));
};

export const RestanseOverTid = (props: ConsumerProps & CommonProps) => <RestanseOverTidCommon {...props} />;

export const RestanseOverTidPerMåned = (props: ConsumerProps & CommonProps) => {
  const { fromFilter, toFilter } = useDateFilter();

  const firstOfMonths = eachMonthOfInterval({
    start: parse(fromFilter, ISO_DATE_FORMAT, new Date()),
    end: parse(toFilter, ISO_DATE_FORMAT, new Date()),
  })
    .map((d) => format(d, ISO_DATE_FORMAT))
    .filter((d) => d >= fromFilter);

  return (
    <RestanseOverTidCommon
      {...props}
      axisLabel={{
        rotate: 45,
        // Only show labels for the 1st of each month
        interval: (_index, value) => value.endsWith('-01'),
      }}
      markLine={{
        symbol: ['none', 'none'],
        animation: false,
        label: { show: false },
        lineStyle: { type: 'dashed', color: 'var(--ax-border-strong)' },
        data: firstOfMonths.map((xAxis) => ({ xAxis })),
      }}
    />
  );
};

const RestanseOverTidHelpText = () => (
  <>
    <BodyLong spacing>
      Viser hvordan restansene utvikler seg over tid. Restanse ved periodestart er antall aktive saker på første dato i
      valgt periode. Restanse ved periodeslutt er antall aktive saker på siste dato i valgt periode. Dersom det er
      mottatt flere saker enn det er ferdigstilt, vises endringen i restanse som <code>+</code>. Dersom det er mottatt
      færre saker enn det er ferdigstilt, vises endringen i restanse som <code>-</code>.
    </BodyLong>

    <BodyLong>
      I X-aksen vises antall aktive saker per tidspunkt, slik at du kan se hvordan restansen endrer seg over tid.
    </BodyLong>
  </>
);
