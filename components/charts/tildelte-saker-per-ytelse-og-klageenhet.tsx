'use client';

import { type ReactNode, useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { useKlageenheterWithUnknown } from '@/components/charts/common/use-klageenheter';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
import { NoData } from '@/components/no-data/no-data';
import { UNKNOWN_ENHET_ID } from '@/lib/constants';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  helpText?: ReactNode;
  behandlinger: BaseBehandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerYtelseOgKlageenhet = ({
  behandlinger,
  relevantYtelser,
  klageenheter,
  title,
  description,
  helpText,
}: Props) => {
  const entries = useYtelseChartData(behandlinger, relevantYtelser);
  const enheter = useKlageenheterWithUnknown(behandlinger, klageenheter);

  const series = useMemo(
    () =>
      enheter.map((enhet) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: enhet.navn,
        data: entries
          .map((entry) => countEnhet(behandlinger, getYtelseIdsForEntry(entry), enhet.id))
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, entries, enheter],
  );

  const labels = useMemo(
    () => entries.map((entry, i) => `${entry.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`),
    [entries, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      helpText={helpText}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series,
        legend: { type: 'scroll' },
      }}
    />
  );
};

/**
 * Count behandlinger for a list of ytelseIds with a specific klageenhet
 */
const countEnhet = (behandlinger: BaseBehandling[], ytelseIds: string[], enhetId: string): number =>
  behandlinger.reduce(
    (acc, curr) =>
      ytelseIds.includes(curr.ytelseId) && (curr.tildeltEnhet ?? UNKNOWN_ENHET_ID) === enhetId ? acc + 1 : acc,
    0,
  );
