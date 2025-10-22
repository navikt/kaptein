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
                Minst én av hjemlene som er valgt i filteret må være i hjemmellisten til behandlingen for at den skal
                tas med i statistikken.
              </BodyLong>

              <Heading level="1" size="xsmall">
                Alle filtrerte
              </Heading>
              <BodyLong spacing>
                Alle hjemlene som er valgt i filteret må være i hjemmellisten til behandlingen for at den skal tas med i
                statistikken.
              </BodyLong>

              <Heading level="1" size="xsmall">
                Alle i behandling
              </Heading>
              <BodyLong spacing>
                Alle hjemlene i behandlingen må være blant de valgte hjemlene i filteret for at den skal tas med i
                statistikken. Hvis behandlingen inneholder en hjemmel som ikke er valgt i filteret, blir den ikke tatt
                med.
              </BodyLong>

              <BodyLong>Hvis det ikke er valgt noen hjemler i filteret vil behandlingen bli tatt med uansett.</BodyLong>
            </HelpText>
          </HStack>
        }
      >
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_FOR_SOME}>
          Minst én
        </ToggleGroup.Item>
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_ALL_SELECTED}>
          Alle filtrerte
        </ToggleGroup.Item>
        <ToggleGroup.Item className="whitespace-nowrap" value={HjemlerModeFilter.INCLUDE_ALL_IN_BEHANDLING}>
          Alle i behandling
        </ToggleGroup.Item>
      </ToggleGroup>
    </HStack>
  );
};
