'use client';
import { Chips, type ChipsProps, HStack, VStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import type { IKodeverkSimpleValue, RegistreringshjemlerMap } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  klageenheter?: IKodeverkSimpleValue[];
  sakstyper?: IKodeverkSimpleValue[];
  utfall?: IKodeverkSimpleValue[];
  ytelser?: IKodeverkSimpleValue[];
  registreringshjemler?: RegistreringshjemlerMap;
  innsendingshjemler?: Record<string, string>;
}

export const ActiveFilters = ({
  ytelser,
  klageenheter,
  sakstyper,
  utfall,
  registreringshjemler,
  innsendingshjemler,
}: Props) => (
  <VStack gap="2">
    {klageenheter === undefined ? null : (
      <Group param={QueryParam.KLAGEENHETER} getName={getKodeverkName(klageenheter)} color="meta-purple" />
    )}
    {sakstyper === undefined ? null : (
      <Group param={QueryParam.SAKSTYPER} getName={getKodeverkName(sakstyper)} color="success" />
    )}
    {utfall === undefined ? null : <Group param={QueryParam.UTFALL} getName={getKodeverkName(utfall)} color="danger" />}
    {ytelser === undefined ? null : (
      <Group param={QueryParam.YTELSER} getName={getKodeverkName(ytelser)} color="accent" />
    )}
    {innsendingshjemler === undefined ? null : (
      <Group
        param={QueryParam.INNSENDINGSHJEMLER}
        getName={getInnsendingshjemmelnavn(innsendingshjemler)}
        color="meta-lime"
      />
    )}
    {registreringshjemler === undefined ? null : (
      <Group
        param={QueryParam.REGISTRERINGSHJEMLER}
        getName={getRegistreringshjemmelnavn(registreringshjemler)}
        color="warning"
      />
    )}
  </VStack>
);

interface GroupProps {
  param: QueryParam;
  getName: (id: string) => string;
  color: ChipsProps['data-color'];
}

const Group = ({ param, getName, color }: GroupProps) => {
  const [values, setValues] = useQueryState(param, parseAsArrayOf(parseAsString).withDefault([]));

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
