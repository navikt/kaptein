import { BodyLong, Heading, HelpText, HStack, ToggleGroup } from '@navikt/ds-react';
import { isHjemlerModeFilter } from '@/app/custom-query-parsers';
import { HjemlerModeFilter } from '@/app/query-types';
import { useInnsendingshjemlerModeFilter, useRegistreringshjemlerModeFilter } from '@/lib/query-state/query-state';

interface Props {
  mode: HjemlerModeFilter;
  setMode: (mode: HjemlerModeFilter) => void;
}

export const RegistreringshjemlerMode = () => {
  const [mode, setMode] = useRegistreringshjemlerModeFilter();

  return <HjemlerMode mode={mode} setMode={setMode} />;
};

export const InnsendingshjemlerMode = () => {
  const [mode, setMode] = useInnsendingshjemlerModeFilter();

  return <HjemlerMode mode={mode} setMode={setMode} />;
};

const HjemlerMode = ({ mode, setMode }: Props) => {
  return (
    <HStack wrap={false} gap="space-16">
      <ToggleGroup
        value={mode}
        onChange={(v) => {
          if (isHjemlerModeFilter(v)) {
            setMode(v);
          }
        }}
        size="small"
        label={
          <HStack gap="space-8" align="center">
            Treff
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
