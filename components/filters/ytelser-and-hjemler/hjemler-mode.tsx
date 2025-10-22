import { BodyLong, Heading, HelpText, HStack, ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { HjemlerModeFilter } from '@/app/query-types';
import type { QueryParam } from '@/lib/types/query-param';

interface Props {
  queryParam: QueryParam;
}

export const HjemlerMode = ({ queryParam }: Props) => {
  const [mode, setMode] = useQueryState(queryParam);

  return (
    <HStack wrap={false} gap="4">
      <ToggleGroup
        value={mode ?? HjemlerModeFilter.INCLUDE_FOR_SOME}
        onChange={(v) => setMode(v)}
        size="small"
        label={
          <HStack gap="2" align="center">
            Match
            <HelpText>
              <Heading level="1" size="xsmall">
                Minst én
              </Heading>
              <BodyLong spacing>
                Saken tas med i statistikken dersom minst én av hjemlene som er valgt i filteret er registrert på saken.
              </BodyLong>

              <Heading level="1" size="xsmall">
                Alle valgte
              </Heading>
              <BodyLong spacing>
                Saken tas med i statistikken dersom alle hjemlene som er valgt i filteret er registrert på saken.
              </BodyLong>

              <Heading level="1" size="xsmall">
                Kun valgte
              </Heading>
              <BodyLong spacing>
                Saken tas med i statistikken dersom kun hjemmelen/hjemlene som er valgt i filteret er registrert på
                saken. Hvis saken inneholder en hjemmel som ikke er valgt i filteret, blir den ikke tatt med.
              </BodyLong>

              <BodyLong>
                Hvis det ikke er valgt noen hjemler i filteret vil saken bli tatt med i statistikken uansett.
              </BodyLong>
            </HelpText>
          </HStack>
        }
      >
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_FOR_SOME}>
          Minst én
        </ToggleGroup.Item>
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_ALL_SELECTED}>
          Alle valgte
        </ToggleGroup.Item>
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_ALL_IN_BEHANDLING}>
          Kun valgte
        </ToggleGroup.Item>
      </ToggleGroup>
    </HStack>
  );
};
