'use client';
import { Chips, type ChipsProps, HStack, VStack } from '@navikt/ds-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { RouteName } from '@/components/header/route-name';
import {
  useInnsendingshjemlerFilter,
  useKaSakstyperFilter,
  useKaUtfallFilter,
  useKlageenheterFilter,
  useRegistreringshjemlerFilter,
  useTrSakstyperFilter,
  useTrUtfallFilter,
  useYtelserFilter,
  useYtelsesgrupperFilter,
} from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue, RegistreringshjemlerMap, Sakstype } from '@/lib/types';
import { YTELSESGRUPPE_KODEVERK } from '@/lib/types/ytelsesgrupper';

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
  const pathname = usePathname();

  const [klageenheter, setKlageenheter] = useKlageenheterFilter();
  const [kaSakstyper, setKaSakstyper] = useKaSakstyperFilter();
  const [trSakstyper, setTrSakstyper] = useTrSakstyperFilter();
  const [kaUtfall, setKaUtfall] = useKaUtfallFilter();
  const [trUtfall, setTrUtfall] = useTrUtfallFilter();
  const [ytelsesgrupper, setYtelsesgrupper] = useYtelsesgrupperFilter();
  const [ytelser, setYtelser] = useYtelserFilter();
  const [innsendingshjemler, setInnsendingshjemler] = useInnsendingshjemlerFilter();
  const [registreringshjemler, setRegistreringshjemler] = useRegistreringshjemlerFilter();

  const isTr = pathname === RouteName.AKTIVE_SAKER_I_TR || pathname === RouteName.FERDIGSTILTE_I_TR;

  return (
    <VStack gap="space-8" width="100%">
      {klageenheterKodeverk === undefined ? null : (
        <Group
          values={klageenheter}
          setValues={setKlageenheter}
          getName={getKodeverkName(klageenheterKodeverk)}
          color="meta-purple"
        />
      )}
      {sakstyperKodeverk === undefined ? null : isTr ? (
        <Group<Sakstype>
          values={trSakstyper}
          setValues={setTrSakstyper}
          getName={getKodeverkName(sakstyperKodeverk)}
          color="success"
        />
      ) : (
        <Group
          values={kaSakstyper}
          setValues={setKaSakstyper}
          getName={getKodeverkName(sakstyperKodeverk)}
          color="success"
        />
      )}
      {utfallKodeverk === undefined ? null : isTr ? (
        <Group values={trUtfall} setValues={setTrUtfall} getName={getKodeverkName(utfallKodeverk)} color="danger" />
      ) : (
        <Group values={kaUtfall} setValues={setKaUtfall} getName={getKodeverkName(utfallKodeverk)} color="danger" />
      )}
      <Group
        values={ytelsesgrupper}
        setValues={setYtelsesgrupper}
        getName={getKodeverkName(YTELSESGRUPPE_KODEVERK)}
        color="accent"
      />
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

interface GroupProps<T extends string> {
  getName: (id: string) => string;
  color: ChipsProps['data-color'];
  values: T[];
  setValues: (values: T[] | null) => void;
}

const Group = <T extends string>({ getName, color, values, setValues }: GroupProps<T>) => {
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
    <HStack gap="space-4" asChild>
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
