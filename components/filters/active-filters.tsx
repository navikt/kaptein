'use client';
import { Chips, type ChipsProps, HStack, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import {
  useInnsendingshjemlerFilter,
  useKlageenheterFilter,
  useRegistreringshjemlerFilter,
  useSakstyperFilter,
  useUtfallFilter,
  useYtelserFilter,
} from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue, RegistreringshjemlerMap } from '@/lib/types';

interface Props {
  klageenheter?: IKodeverkSimpleValue[];
  sakstyper?: IKodeverkSimpleValue[];
  utfall?: IKodeverkSimpleValue[];
  ytelser?: IKodeverkSimpleValue[];
  registreringshjemler?: RegistreringshjemlerMap;
  innsendingshjemler?: Record<string, string>;
}

export const ActiveFilters = ({
  ytelser: ytelserKodeverk,
  klageenheter: klageenheterKodeverk,
  sakstyper: sakstyperKodeverk,
  utfall: utfallKodeverk,
  registreringshjemler: registreringshjemlerKodeverk,
  innsendingshjemler: innsendingshjemlerKodeverk,
}: Props) => {
  const [klageenheter, setKlageenheter] = useKlageenheterFilter();
  const [sakstyper, setSakstyper] = useSakstyperFilter();
  const [utfall, setUtfall] = useUtfallFilter();
  const [ytelser, setYtelser] = useYtelserFilter();
  const [innsendingshjemler, setInnsendingshjemler] = useInnsendingshjemlerFilter();
  const [registreringshjemler, setRegistreringshjemler] = useRegistreringshjemlerFilter();

  return (
    <VStack gap="2" width="100%">
      {klageenheterKodeverk === undefined ? null : (
        <Group
          values={klageenheter}
          setValues={setKlageenheter}
          getName={getKodeverkName(klageenheterKodeverk)}
          color="meta-purple"
        />
      )}
      {sakstyperKodeverk === undefined ? null : (
        <Group
          values={sakstyper}
          setValues={setSakstyper}
          getName={getKodeverkName(sakstyperKodeverk)}
          color="success"
        />
      )}
      {utfallKodeverk === undefined ? null : (
        <Group values={utfall} setValues={setUtfall} getName={getKodeverkName(utfallKodeverk)} color="danger" />
      )}
      {ytelserKodeverk === undefined ? null : (
        <Group
          values={ytelser}
          setValues={(v) => {
            setYtelser(v);
            setInnsendingshjemler(null);
            setRegistreringshjemler(null);
          }}
          getName={getKodeverkName(ytelserKodeverk)}
          color="accent"
        />
      )}
      {innsendingshjemlerKodeverk === undefined ? null : (
        <Group
          values={innsendingshjemler}
          setValues={setInnsendingshjemler}
          getName={getInnsendingshjemmelnavn(innsendingshjemlerKodeverk)}
          color="meta-lime"
        />
      )}
      {registreringshjemlerKodeverk === undefined ? null : (
        <Group
          values={registreringshjemler}
          setValues={setRegistreringshjemler}
          getName={getRegistreringshjemmelnavn(registreringshjemlerKodeverk)}
          color="warning"
        />
      )}
    </VStack>
  );
};

interface GroupProps {
  getName: (id: string) => string;
  color: ChipsProps['data-color'];
  values: string[];
  setValues: (values: string[] | null) => void;
}

const Group = ({ getName, color, values, setValues }: GroupProps) => {
  const children = useMemo(
    () =>
      values.map((v) => (
        <Chips.Removable
          key={v}
          onClick={() => {
            const newValues = values.filter((y) => y !== v);
            setValues(newValues.length === 0 ? null : newValues);
          }}
        >
          {getName(v)}
        </Chips.Removable>
      )),
    [values, setValues, getName],
  );

  if (values.length === 0) {
    return null;
  }

  return (
    <HStack gap="1" asChild>
      <Chips data-color={color}>{children}</Chips>
    </HStack>
  );
};

const getKodeverkName = (kodeverk: IKodeverkSimpleValue[]) => (id: string) => {
  const value = kodeverk.find((k) => k.id === id);

  return value === undefined ? id : value.navn;
};

const getRegistreringshjemmelnavn = (map: RegistreringshjemlerMap) => (id: string) => {
  const hjemmel = map[id];

  return hjemmel === undefined ? id : `${hjemmel.lovkilde.beskrivelse} - ${hjemmel.hjemmelnavn}`;
};

const getInnsendingshjemmelnavn = (map: Record<string, string>) => (id: string) => {
  const hjemmel = map[id];

  return hjemmel === undefined ? id : hjemmel;
};
