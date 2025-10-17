import { KeyStat } from '@/components/key-stats/key-stat';
import type { Resultat } from '@/lib/types';

interface Result {
  resultat: Resultat | null;
}

interface Props {
  behandlinger: Result[];
}

export const Omgjøringsprosent = ({ behandlinger }: Props) => {
  const total = behandlinger.length;
  const omgjorte = behandlinger.filter(
    (b) =>
      b.resultat?.utfallId === '3' || // Opphevet
      b.resultat?.utfallId === '4' || // Medhold
      b.resultat?.utfallId === '5', // Delvis medhold
  ).length;

  const prosent = total > 0 ? (omgjorte / total) * 100 : 0;

  return (
    <KeyStat
      title="Omgjøringsprosent"
      value={prosent.toFixed(2) + '%'}
      description={`Basert på ${total} ferdigstilte behandlinger`}
    />
  );
};
