import { headers } from 'next/headers';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, getFromKabal } from '@/lib/server/fetch';
import type { IUserData } from '@/lib/server/types';

const logger = getLogger('api');

const KABAL_API = isLocal ? 'https://kaptein.intern.dev.nav.no/api/' : 'http://kabal-api/api/kaptein';
const _KABAL_INNSTILLINGER = isLocal ? 'https://kaptein.intern.dev.nav.no/api/' : 'http://kabal-innstillinger/api';
const _KLAGE_KODEVERK = isLocal ? 'https://kaptein.intern.dev.nav.no/kodeverk/' : 'http://klage-kodeverk-api/kodeverk';

const _getData = async <T>(headers: Headers, url: string): Promise<T> => {
  const { traceparent, traceId, spanId } = generateTraceParent();

  try {
    const res = await (isLocal ? fetch(url, { headers }) : getFromKabal(url, headers, traceparent));

    if (res.status === 401) {
      logger.warn('Unauthorized fetch of cases', traceId, spanId);
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      logger.error(`Failed to fetch cases - ${res.status}`, traceId, spanId);
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    const data: T = await res.json();

    return data;
  } catch (error) {
    logger.error('Failed to fetch cases', traceId, spanId, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? (error.stack ?? '') : '',
    });

    throw error;
  }
};

// export const getUser = async (): Promise<IUserData> =>
//   getData(await headers(), 'https://kabal.intern.dev.nav.no/api/kabal-innstillinger/me/brukerdata');

export const getUser = async (): Promise<IUserData> => {
  return {
    navIdent: 'Z994862',
    navn: 'F_Z994862 E_Z994862',
    roller: [],
    enheter: [
      {
        id: '4295',
        navn: 'Nav Klageinstans nord',
        lovligeYtelser: [],
      },
    ],
    ansattEnhet: {
      id: '4295',
      navn: 'Nav Klageinstans nord',
      lovligeYtelser: [],
    },
    tildelteYtelser: [],
  };
};

// export const getYtelser = async () => getData<IYtelse[]>(await headers(), `${KLAGE_KODEVERK}/ytelser`);
export const getBehandlinger = async () => _getData<unknown[]>(await headers(), `${KABAL_API}/behandlinger`);

export const getYtelser = () =>
  Promise.resolve([
    {
      id: '41',
      navn: 'AA-register',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '63',
            navn: 'Forskrift om AA-registeret',
            beskrivelse: 'Forskrift om AA-registeret',
          },
          registreringshjemler: [
            {
              id: 'FS_OM_AA_REGISTERET_2',
              navn: '§ 2',
            },
            {
              id: 'FS_OM_AA_REGISTERET_3',
              navn: '§ 3',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4534',
          navn: 'Nav Registerforvaltning',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '25',
      navn: 'Alderspensjon',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '485',
              navn: '§ 1-5',
            },
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '417',
              navn: '§ 2-4',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '486',
              navn: '§ 3-2',
            },
            {
              id: '487',
              navn: '§ 3-3',
            },
            {
              id: '488',
              navn: '§ 3-5',
            },
            {
              id: '489',
              navn: '§ 3-7',
            },
            {
              id: '490',
              navn: '§ 3-8',
            },
            {
              id: '491',
              navn: '§ 3-9',
            },
            {
              id: '492',
              navn: '§ 3-10',
            },
            {
              id: '493',
              navn: '§ 3-11',
            },
            {
              id: '494',
              navn: '§ 3-12',
            },
            {
              id: '495',
              navn: '§ 3-13',
            },
            {
              id: '496',
              navn: '§ 3-14',
            },
            {
              id: '497',
              navn: '§ 3-15',
            },
            {
              id: '498',
              navn: '§ 3-16',
            },
            {
              id: '499',
              navn: '§ 3-17',
            },
            {
              id: '500',
              navn: '§ 3-18',
            },
            {
              id: '501',
              navn: '§ 3-19',
            },
            {
              id: '502',
              navn: '§ 3-22',
            },
            {
              id: '503',
              navn: '§ 3-23',
            },
            {
              id: '504',
              navn: '§ 3-24',
            },
            {
              id: '505',
              navn: '§ 3-25',
            },
            {
              id: '506',
              navn: '§ 3-26',
            },
            {
              id: '464',
              navn: '§ 19-2',
            },
            {
              id: '465',
              navn: '§ 19-3',
            },
            {
              id: '466',
              navn: '§ 19-4',
            },
            {
              id: '467',
              navn: '§ 19-5',
            },
            {
              id: 'FTRL_19_5A',
              navn: '§ 19-5 beregning',
            },
            {
              id: '468',
              navn: '§ 19-6',
            },
            {
              id: '469',
              navn: '§ 19-7',
            },
            {
              id: '470',
              navn: '§ 19-8',
            },
            {
              id: '471',
              navn: '§ 19-9',
            },
            {
              id: 'FTRL_19_9A',
              navn: '§ 19-9 a',
            },
            {
              id: '472',
              navn: '§ 19-10',
            },
            {
              id: '473',
              navn: '§ 19-11',
            },
            {
              id: '474',
              navn: '§ 19-12',
            },
            {
              id: '475',
              navn: '§ 19-13',
            },
            {
              id: '476',
              navn: '§ 19-14',
            },
            {
              id: '477',
              navn: '§ 19-15',
            },
            {
              id: '478',
              navn: '§ 19-16',
            },
            {
              id: '479',
              navn: '§ 19-17',
            },
            {
              id: '480',
              navn: '§ 19-18',
            },
            {
              id: '481',
              navn: '§ 19-19',
            },
            {
              id: '482',
              navn: '§ 19-20',
            },
            {
              id: '483',
              navn: '§ 19-21',
            },
            {
              id: '484',
              navn: '§ 19-22',
            },
            {
              id: '507',
              navn: '§ 20-2',
            },
            {
              id: '508',
              navn: '§ 20-3',
            },
            {
              id: '509',
              navn: '§ 20-4',
            },
            {
              id: '510',
              navn: '§ 20-5',
            },
            {
              id: '511',
              navn: '§ 20-6',
            },
            {
              id: '512',
              navn: '§ 20-7',
            },
            {
              id: 'FTRL_20_7A',
              navn: '§ 20-7 a',
            },
            {
              id: '513',
              navn: '§ 20-8',
            },
            {
              id: '514',
              navn: '§ 20-9',
            },
            {
              id: '515',
              navn: '§ 20-10',
            },
            {
              id: '516',
              navn: '§ 20-11',
            },
            {
              id: '517',
              navn: '§ 20-12',
            },
            {
              id: '518',
              navn: '§ 20-13',
            },
            {
              id: '519',
              navn: '§ 20-14',
            },
            {
              id: 'FTRL_20_14A',
              navn: '§ 20-14 beregning',
            },
            {
              id: '520',
              navn: '§ 20-15',
            },
            {
              id: '521',
              navn: '§ 20-16',
            },
            {
              id: '522',
              navn: '§ 20-17',
            },
            {
              id: '523',
              navn: '§ 20-18',
            },
            {
              id: '524',
              navn: '§ 20-19',
            },
            {
              id: '525',
              navn: '§ 20-20',
            },
            {
              id: '526',
              navn: '§ 20-21',
            },
            {
              id: '527',
              navn: '§ 20-22',
            },
            {
              id: '528',
              navn: '§ 20-23',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '529',
              navn: '§ 21-4',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
            {
              id: 'FTRL_AV_1966_1_2',
              navn: 'Folketrygdloven av 1966 §1-2',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '530',
              navn: 'art. 1',
            },
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '379',
              navn: 'art. 50',
            },
            {
              id: '380',
              navn: 'art. 51',
            },
            {
              id: '381',
              navn: 'art. 52',
            },
            {
              id: '531',
              navn: 'art. 53',
            },
            {
              id: '532',
              navn: 'art. 54',
            },
            {
              id: '533',
              navn: 'art. 55',
            },
            {
              id: '534',
              navn: 'art. 56',
            },
            {
              id: '382',
              navn: 'art. 57',
            },
            {
              id: '383',
              navn: 'art. 58',
            },
            {
              id: '535',
              navn: 'art. 59',
            },
            {
              id: '536',
              navn: 'art. 60',
            },
            {
              id: '385',
              navn: 'art. 70',
            },
            {
              id: '386',
              navn: 'art. 87',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '537',
              navn: 'art. 10',
            },
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '314',
              navn: 'art. 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '20',
            navn: 'Forordning 1408/71',
            beskrivelse: 'Forordning 1408/71',
          },
          registreringshjemler: [
            {
              id: 'EOES_FORORDNING_1408_71_13',
              navn: 'art. 13',
            },
            {
              id: 'EOES_FORORDNING_1408_71_14',
              navn: 'art. 14',
            },
            {
              id: 'EOES_FORORDNING_1408_71_14A',
              navn: 'art. 14 a',
            },
            {
              id: 'EOES_FORORDNING_1408_71_14B',
              navn: 'art. 14 b',
            },
            {
              id: 'EOES_FORORDNING_1408_71_14C',
              navn: 'art. 14 c',
            },
            {
              id: 'EOES_FORORDNING_1408_71_14D',
              navn: 'art. 14 d',
            },
            {
              id: 'EOES_FORORDNING_1408_71_15',
              navn: 'art. 15',
            },
            {
              id: 'EOES_FORORDNING_1408_71_16',
              navn: 'art. 16',
            },
            {
              id: 'EOES_FORORDNING_1408_71_17',
              navn: 'art. 17',
            },
            {
              id: '395',
              navn: 'Forordning 1408/71',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '23',
            navn: 'Trygdeavtaler med England',
            beskrivelse: 'Trygdeavtaler med England',
          },
          registreringshjemler: [
            {
              id: '539',
              navn: 'Trygdeavtaler med England',
            },
          ],
        },
        {
          lovkilde: {
            id: '24',
            navn: 'Trygdeavtaler med USA',
            beskrivelse: 'Trygdeavtaler med USA',
          },
          registreringshjemler: [
            {
              id: '540',
              navn: 'Trygdeavtaler med USA',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4808',
          navn: 'Nav Familie- og pensjonsytelser Porsgrunn',
        },
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '0001',
          navn: 'Nav Pensjon Utland',
        },
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '4862',
          navn: 'Nav Familie- og pensjonsytelser utland Ålesund',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_19_OG_20_UFOERE_TIL_ALDER',
          navn: 'Ftrl - 19 og 20 uføre til alder',
          beskrivelse: 'Folketrygdloven - 19 og 20 uføre til alder',
        },
        {
          id: 'FTRL_19_OG_20_BEREGNING',
          navn: 'Ftrl - 19 og 20 beregning',
          beskrivelse: 'Folketrygdloven - 19 og 20 beregning',
        },
        {
          id: 'FTRL_19_2',
          navn: 'Ftrl - § 19-2',
          beskrivelse: 'Folketrygdloven - § 19-2',
        },
        {
          id: 'FTRL_19_3',
          navn: 'Ftrl - § 19-3',
          beskrivelse: 'Folketrygdloven - § 19-3',
        },
        {
          id: 'FTRL_19_4',
          navn: 'Ftrl - § 19-4',
          beskrivelse: 'Folketrygdloven - § 19-4',
        },
        {
          id: 'FTRL_19_5',
          navn: 'Ftrl - § 19-5',
          beskrivelse: 'Folketrygdloven - § 19-5',
        },
        {
          id: 'FTRL_19_5_BEREGNING',
          navn: 'Ftrl - § 19-5 beregning',
          beskrivelse: 'Folketrygdloven - § 19-5 beregning',
        },
        {
          id: 'FTRL_19_6',
          navn: 'Ftrl - § 19-6',
          beskrivelse: 'Folketrygdloven - § 19-6',
        },
        {
          id: 'FTRL_19_7',
          navn: 'Ftrl - § 19-7',
          beskrivelse: 'Folketrygdloven - § 19-7',
        },
        {
          id: 'FTRL_19_8_MINSTE_PENSJONSNIVAA',
          navn: 'Ftrl - § 19-8 minste pensjonsnivå',
          beskrivelse: 'Folketrygdloven - § 19-8 minste pensjonsnivå',
        },
        {
          id: 'FTRL_19_9',
          navn: 'Ftrl - § 19-9',
          beskrivelse: 'Folketrygdloven - § 19-9',
        },
        {
          id: 'FTRL_19_10',
          navn: 'Ftrl - § 19-10',
          beskrivelse: 'Folketrygdloven - § 19-10',
        },
        {
          id: 'FTRL_19_11_OG_20_15',
          navn: 'Ftrl - § 19-11 og 20-15 avslag tidliguttak',
          beskrivelse: 'Folketrygdloven - § 19-11 og 20-15 avslag tidliguttak',
        },
        {
          id: 'FTRL_19_12',
          navn: 'Ftrl - § 19-12',
          beskrivelse: 'Folketrygdloven - § 19-12',
        },
        {
          id: 'FTRL_19_13_OG_20_17',
          navn: 'Ftrl - § 19-13 og 20-17 omregning ved pensjonsopptjening',
          beskrivelse: 'Folketrygdloven - § 19-13 og 20-17 omregning ved pensjonsopptjening',
        },
        {
          id: 'FTRL_19_14',
          navn: 'Ftrl - § 19-14',
          beskrivelse: 'Folketrygdloven - § 19-14',
        },
        {
          id: 'FTRL_19_15',
          navn: 'Ftrl - § 19-15',
          beskrivelse: 'Folketrygdloven - § 19-15',
        },
        {
          id: 'FTRL_19_16_GJENLEVENDETILLEGG',
          navn: 'Ftrl - § 19-16 gjenlevendetillegg',
          beskrivelse: 'Folketrygdloven - § 19-16 gjenlevendetillegg',
        },
        {
          id: 'FTRL_19_17',
          navn: 'Ftrl - § 19-17',
          beskrivelse: 'Folketrygdloven - § 19-17',
        },
        {
          id: 'FTRL_19_18',
          navn: 'Ftrl - § 19-18',
          beskrivelse: 'Folketrygdloven - § 19-18',
        },
        {
          id: 'FTRL_19_19',
          navn: 'Ftrl - § 19-19',
          beskrivelse: 'Folketrygdloven - § 19-19',
        },
        {
          id: 'FTRL_19_20_YRKESSKADE',
          navn: 'Ftrl - § 19-20 yrkesskade',
          beskrivelse: 'Folketrygdloven - § 19-20 yrkesskade',
        },
        {
          id: 'FTRL_19_21_INSTITUSJON',
          navn: 'Ftrl - § 19-21 institusjon',
          beskrivelse: 'Folketrygdloven - § 19-21 institusjon',
        },
        {
          id: 'FTRL_19_22_SONING',
          navn: 'Ftrl - § 19-22 soning',
          beskrivelse: 'Folketrygdloven - § 19-22 soning',
        },
        {
          id: 'FTRL_1_5',
          navn: 'Ftrl - § 1-5',
          beskrivelse: 'Folketrygdloven - § 1-5',
        },
        {
          id: 'FTRL_2_1_2_2_2_4_2_13_2_14_MEDLEMSKAP',
          navn: 'Ftrl - § 2-1 / 2-2 / 2-4 / 2-13 / 2-14 medlemskap',
          beskrivelse: 'Folketrygdloven - § 2-1 / 2-2 / 2-4 / 2-13 / 2-14 medlemskap',
        },
        {
          id: 'FTRL_3_2_INNTEKT',
          navn: 'Ftrl - § 3-2 inntekt',
          beskrivelse: 'Folketrygdloven - § 3-2 inntekt',
        },
        {
          id: 'FTRL_3_2_SIVILSTAND',
          navn: 'Ftrl - § 3-2 sivilstand',
          beskrivelse: 'Folketrygdloven - § 3-2 sivilstand',
        },
        {
          id: 'FTRL_3_3',
          navn: 'Ftrl - § 3-3',
          beskrivelse: 'Folketrygdloven - § 3-3',
        },
        {
          id: 'FTRL_3_5_TRYGDETID',
          navn: 'Ftrl - § 3-5 (trygdetid)',
          beskrivelse: 'Folketrygdloven - § 3-5 (trygdetid)',
        },
        {
          id: 'FTRL_3_7',
          navn: 'Ftrl - § 3-7',
          beskrivelse: 'Folketrygdloven - § 3-7',
        },
        {
          id: 'FTRL_3_8',
          navn: 'Ftrl - § 3-8',
          beskrivelse: 'Folketrygdloven - § 3-8',
        },
        {
          id: 'FTRL_3_9',
          navn: 'Ftrl - § 3-9',
          beskrivelse: 'Folketrygdloven - § 3-9',
        },
        {
          id: 'FTRL_3_10',
          navn: 'Ftrl - § 3-10',
          beskrivelse: 'Folketrygdloven - § 3-10',
        },
        {
          id: 'FTRL_3_11',
          navn: 'Ftrl - § 3-11',
          beskrivelse: 'Folketrygdloven - § 3-11',
        },
        {
          id: 'FTRL_3_12',
          navn: 'Ftrl - § 3-12',
          beskrivelse: 'Folketrygdloven - § 3-12',
        },
        {
          id: 'FTRL_3_13',
          navn: 'Ftrl - § 3-13',
          beskrivelse: 'Folketrygdloven - § 3-13',
        },
        {
          id: 'FTRL_3_14_PP',
          navn: 'Ftrl - § 3-14 PP',
          beskrivelse: 'Folketrygdloven - § 3-14 PP',
        },
        {
          id: 'FTRL_3_15_PI',
          navn: 'Ftrl - § 3-15 PI',
          beskrivelse: 'Folketrygdloven - § 3-15 PI',
        },
        {
          id: 'FTRL_3_16_OMSORGSPOENG',
          navn: 'Ftrl - § 3-16 Omsorgspoeng',
          beskrivelse: 'Folketrygdloven - § 3-16 Omsorgspoeng',
        },
        {
          id: 'FTRL_3_17',
          navn: 'Ftrl - § 3-17',
          beskrivelse: 'Folketrygdloven - § 3-17',
        },
        {
          id: 'FTRL_3_18',
          navn: 'Ftrl - § 3-18',
          beskrivelse: 'Folketrygdloven - § 3-18',
        },
        {
          id: 'FTRL_3_19',
          navn: 'Ftrl - § 3-19',
          beskrivelse: 'Folketrygdloven - § 3-19',
        },
        {
          id: 'FTRL_3_22',
          navn: 'Ftrl - § 3-22',
          beskrivelse: 'Folketrygdloven - § 3-22',
        },
        {
          id: 'FTRL_3_23',
          navn: 'Ftrl - § 3-23',
          beskrivelse: 'Folketrygdloven - § 3-23',
        },
        {
          id: 'FTRL_3_24_3_26_EKTEFELLETILLEGG',
          navn: 'Ftrl - § 3-24 / 3-26 ektefelletillegg',
          beskrivelse: 'Folketrygdloven - § 3-24 / 3-26 ektefelletillegg',
        },
        {
          id: 'FTRL_3_25_3_26_BARNETILLEGG',
          navn: 'Ftrl - § 3-25 / 3-26 barnetillegg',
          beskrivelse: 'Folketrygdloven - § 3-25 / 3-26 barnetillegg',
        },
        {
          id: 'FTRL_20_2',
          navn: 'Ftrl - § 20-2',
          beskrivelse: 'Folketrygdloven - § 20-2',
        },
        {
          id: 'FTRL_20_3',
          navn: 'Ftrl - § 20-3',
          beskrivelse: 'Folketrygdloven - § 20-3',
        },
        {
          id: 'FTRL_20_4',
          navn: 'Ftrl - § 20-4',
          beskrivelse: 'Folketrygdloven - § 20-4',
        },
        {
          id: 'FTRL_20_5',
          navn: 'Ftrl - § 20-5',
          beskrivelse: 'Folketrygdloven - § 20-5',
        },
        {
          id: 'FTRL_20_6',
          navn: 'Ftrl - § 20-6',
          beskrivelse: 'Folketrygdloven - § 20-6',
        },
        {
          id: 'FTRL_20_7',
          navn: 'Ftrl - § 20-7',
          beskrivelse: 'Folketrygdloven - § 20-7',
        },
        {
          id: 'FTRL_20_7_A',
          navn: 'Ftrl - § 20-7 a',
          beskrivelse: 'Folketrygdloven - § 20-7 a',
        },
        {
          id: 'FTRL_20_8',
          navn: 'Ftrl - § 20-8',
          beskrivelse: 'Folketrygdloven - § 20-8',
        },
        {
          id: 'FTRL_20_9',
          navn: 'Ftrl - § 20-9',
          beskrivelse: 'Folketrygdloven - § 20-9',
        },
        {
          id: 'FTRL_20_10',
          navn: 'Ftrl - § 20-10',
          beskrivelse: 'Folketrygdloven - § 20-10',
        },
        {
          id: 'FTRL_20_11',
          navn: 'Ftrl - § 20-11',
          beskrivelse: 'Folketrygdloven - § 20-11',
        },
        {
          id: 'FTRL_20_12',
          navn: 'Ftrl - § 20-12',
          beskrivelse: 'Folketrygdloven - § 20-12',
        },
        {
          id: 'FTRL_20_13',
          navn: 'Ftrl - § 20-13',
          beskrivelse: 'Folketrygdloven - § 20-13',
        },
        {
          id: 'FTRL_20_14',
          navn: 'Ftrl - § 20-14',
          beskrivelse: 'Folketrygdloven - § 20-14',
        },
        {
          id: 'FTRL_20_14_BEREGNING',
          navn: 'Ftrl - § 20-14 beregning',
          beskrivelse: 'Folketrygdloven - § 20-14 beregning',
        },
        {
          id: 'FTRL_20_15',
          navn: 'Ftrl - § 20-15',
          beskrivelse: 'Folketrygdloven - § 20-15',
        },
        {
          id: 'FTRL_20_16',
          navn: 'Ftrl - § 20-16',
          beskrivelse: 'Folketrygdloven - § 20-16',
        },
        {
          id: 'FTRL_20_17',
          navn: 'Ftrl - § 20-17',
          beskrivelse: 'Folketrygdloven - § 20-17',
        },
        {
          id: 'FTRL_20_18',
          navn: 'Ftrl - § 20-18',
          beskrivelse: 'Folketrygdloven - § 20-18',
        },
        {
          id: 'FTRL_20_19',
          navn: 'Ftrl - § 20-19',
          beskrivelse: 'Folketrygdloven - § 20-19',
        },
        {
          id: 'FTRL_20_20',
          navn: 'Ftrl - § 20-20',
          beskrivelse: 'Folketrygdloven - § 20-20',
        },
        {
          id: 'FTRL_20_21',
          navn: 'Ftrl - § 20-21',
          beskrivelse: 'Folketrygdloven - § 20-21',
        },
        {
          id: 'FTRL_20_22',
          navn: 'Ftrl - § 20-22',
          beskrivelse: 'Folketrygdloven - § 20-22',
        },
        {
          id: 'FTRL_20_23',
          navn: 'Ftrl - § 20-23',
          beskrivelse: 'Folketrygdloven - § 20-23',
        },
        {
          id: 'FTRL_21_6',
          navn: 'Ftrl - § 21-6',
          beskrivelse: 'Folketrygdloven - § 21-6',
        },
        {
          id: 'FTRL_21_12_KLAGEFRIST',
          navn: 'Ftrl - § 21-12 klagefrist',
          beskrivelse: 'Folketrygdloven - § 21-12 klagefrist',
        },
        {
          id: 'FTRL_22_6',
          navn: 'Ftrl - § 22-6',
          beskrivelse: 'Folketrygdloven - § 22-6',
        },
        {
          id: 'FTRL_22_8',
          navn: 'Ftrl - § 22-8',
          beskrivelse: 'Folketrygdloven - § 22-8',
        },
        {
          id: 'FTRL_22_12_22_13',
          navn: 'Ftrl - § 22-12 / § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-12 / § 22-13',
        },
        {
          id: 'FTRL_22_15_TILBAKEKREVING',
          navn: 'Ftrl - § 22-15 tilbakekreving',
          beskrivelse: 'Folketrygdloven - § 22-15 tilbakekreving',
        },
        {
          id: 'FTRL_22_15_TILBAKEKREVING_DOEDSBO',
          navn: 'Ftrl - § 22-15 tilbakekreving dødsbo',
          beskrivelse: 'Folketrygdloven - § 22-15 tilbakekreving dødsbo',
        },
        {
          id: 'FTRL_22_16',
          navn: 'Ftrl - § 22-16',
          beskrivelse: 'Folketrygdloven - § 22-16',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FVL_35_C_UGUNST',
          navn: 'Fvl - § 35 c ugunst',
          beskrivelse: 'Forvaltningsloven - § 35 c ugunst',
        },
        {
          id: 'FVL_35_OMGJOERING',
          navn: 'Fvl - § 35 - Krav om omgjøring',
          beskrivelse: 'Forvaltningsloven - § 35 - Krav om omgjøring',
        },
        {
          id: 'EOES_883_2004_1',
          navn: 'EØS forordning 883/2004 - art. 1',
          beskrivelse: 'EØS forordning 883/2004 - art. 1',
        },
        {
          id: 'EOES_883_2004_2_OMFATTET',
          navn: 'EØS forordning 883/2004 - art. 2 omfattet',
          beskrivelse: 'EØS forordning 883/2004 - art. 2 omfattet',
        },
        {
          id: 'EOES_883_2004_6_SAMMENLEGGING',
          navn: 'EØS forordning 883/2004 - art. 6 sammenlegging',
          beskrivelse: 'EØS forordning 883/2004 - art. 6 sammenlegging',
        },
        {
          id: 'EOES_883_2004_7',
          navn: 'EØS forordning 883/2004 - art. 7',
          beskrivelse: 'EØS forordning 883/2004 - art. 7',
        },
        {
          id: 'EOES_883_2004_10',
          navn: 'EØS forordning 883/2004 - art. 10',
          beskrivelse: 'EØS forordning 883/2004 - art. 10',
        },
        {
          id: 'EOES_883_2004_11',
          navn: 'EØS forordning 883/2004 - art. 11',
          beskrivelse: 'EØS forordning 883/2004 - art. 11',
        },
        {
          id: 'EOES_883_2004_12',
          navn: 'EØS forordning 883/2004 - art. 12',
          beskrivelse: 'EØS forordning 883/2004 - art. 12',
        },
        {
          id: 'EOES_883_2004_13_AKTIVITET_I_FLERE_LAND',
          navn: 'EØS forordning 883/2004 - art. 13 aktivitet i flere land',
          beskrivelse: 'EØS forordning 883/2004 - art. 13 aktivitet i flere land',
        },
        {
          id: 'EOES_883_2004_50',
          navn: 'EØS forordning 883/2004 - art. 50',
          beskrivelse: 'EØS forordning 883/2004 - art. 50',
        },
        {
          id: 'EOES_883_2004_51_SAMMENLEGGING',
          navn: 'EØS forordning 883/2004 - art. 51 sammenlegging av tid',
          beskrivelse: 'EØS forordning 883/2004 - art. 51 sammenlegging av tid',
        },
        {
          id: 'EOES_883_2004_52',
          navn: 'EØS forordning 883/2004 - art. 52',
          beskrivelse: 'EØS forordning 883/2004 - art. 52',
        },
        {
          id: 'EOES_883_2004_53',
          navn: 'EØS forordning 883/2004 - art. 53',
          beskrivelse: 'EØS forordning 883/2004 - art. 53',
        },
        {
          id: 'EOES_883_2004_54',
          navn: 'EØS forordning 883/2004 - art. 54',
          beskrivelse: 'EØS forordning 883/2004 - art. 54',
        },
        {
          id: 'EOES_883_2004_55',
          navn: 'EØS forordning 883/2004 - art. 55',
          beskrivelse: 'EØS forordning 883/2004 - art. 55',
        },
        {
          id: 'EOES_883_2004_56',
          navn: 'EØS forordning 883/2004 - art. 56',
          beskrivelse: 'EØS forordning 883/2004 - art. 56',
        },
        {
          id: 'EOES_883_2004_57',
          navn: 'EØS forordning 883/2004 - art. 57',
          beskrivelse: 'EØS forordning 883/2004 - art. 57',
        },
        {
          id: 'EOES_883_2004_58_MINSTEYTELSE',
          navn: 'EØS forordning 883/2004 - art. 58 minsteytelse',
          beskrivelse: 'EØS forordning 883/2004 - art. 58 minsteytelse',
        },
        {
          id: 'EOES_883_2004_59',
          navn: 'EØS forordning 883/2004 - art. 59',
          beskrivelse: 'EØS forordning 883/2004 - art. 59',
        },
        {
          id: 'EOES_883_2004_60',
          navn: 'EØS forordning 883/2004 - art. 60',
          beskrivelse: 'EØS forordning 883/2004 - art. 60',
        },
        {
          id: 'EOES_883_2004_70',
          navn: 'EØS forordning 883/2004 - art. 70',
          beskrivelse: 'EØS forordning 883/2004 - art. 70',
        },
        {
          id: 'EOES_883_2004_87',
          navn: 'EØS forordning 883/2004 - art. 87',
          beskrivelse: 'EØS forordning 883/2004 - art. 87',
        },
        {
          id: 'GJ_F_FORD_987_2009_10',
          navn: 'Gjennomføringsforordning 987/2009 - art. 10',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 10',
        },
        {
          id: 'GJ_F_FORD_987_2009_11',
          navn: 'Gjennomføringsforordning 987/2009 - art. 11',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 11',
        },
        {
          id: 'GJ_F_FORD_987_2009_12',
          navn: 'Gjennomføringsforordning 987/2009 - art. 12',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 12',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
        {
          id: 'TRYGDEAVTALE_MED_ENGLAND',
          navn: 'Trygdeavtaler med England - Trygdeavtale med England',
          beskrivelse: 'Trygdeavtaler med England - Trygdeavtale med England',
        },
        {
          id: 'TRYGDEAVTALE_MED_USA',
          navn: 'Trygdeavtaler med USA - Trygdeavtale med USA',
          beskrivelse: 'Trygdeavtaler med USA - Trygdeavtale med USA',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
      ],
    },
    {
      id: '9',
      navn: 'Arbeidsavklaringspenger (AAP)',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '308',
              navn: '§ 1-3',
            },
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: 'FTRL_11_0B',
              navn: '§ 11-0 forenklet o-brev',
            },
            {
              id: 'FTRL_11_0C',
              navn: '§ 11-0 uten o-brev',
            },
            {
              id: 'FTRL_11_0A',
              navn: '§ 11-0 vanlig o-brev',
            },
            {
              id: '271',
              navn: '§ 11-2',
            },
            {
              id: '272',
              navn: '§ 11-3',
            },
            {
              id: '273',
              navn: '§ 11-4',
            },
            {
              id: '275',
              navn: '§ 11-5 gjenopptak',
            },
            {
              id: '274',
              navn: '§ 11-5 ny søknad',
            },
            {
              id: '276',
              navn: '§ 11-5 opphør',
            },
            {
              id: '278',
              navn: '§ 11-6 gjenopptak',
            },
            {
              id: '277',
              navn: '§ 11-6 ny søknad',
            },
            {
              id: '279',
              navn: '§ 11-6 opphør',
            },
            {
              id: '280',
              navn: '§ 11-7',
            },
            {
              id: '281',
              navn: '§ 11-8',
            },
            {
              id: '282',
              navn: '§ 11-9',
            },
            {
              id: '283',
              navn: '§ 11-10',
            },
            {
              id: '284',
              navn: '§ 11-12 andre ledd',
            },
            {
              id: '285',
              navn: '§ 11-12 tredje ledd',
            },
            {
              id: '286',
              navn: '§ 11-12 fjerde ledd',
            },
            {
              id: '287',
              navn: '§ 11-13',
            },
            {
              id: '288',
              navn: '§ 11-14',
            },
            {
              id: '289',
              navn: '§ 11-15',
            },
            {
              id: '290',
              navn: '§ 11-17',
            },
            {
              id: '291',
              navn: '§ 11-18',
            },
            {
              id: '292',
              navn: '§ 11-19',
            },
            {
              id: '293',
              navn: '§ 11-20 første og andre ledd',
            },
            {
              id: '294',
              navn: '§ 11-20 tredje til femte ledd',
            },
            {
              id: '295',
              navn: '§ 11-21',
            },
            {
              id: '296',
              navn: '§ 11-22 første ledd',
            },
            {
              id: '297',
              navn: '§ 11-22 andre og tredje ledd',
            },
            {
              id: '298',
              navn: '§ 11-23',
            },
            {
              id: '299',
              navn: '§ 11-24',
            },
            {
              id: '300',
              navn: '§ 11-25',
            },
            {
              id: '301',
              navn: '§ 11-26',
            },
            {
              id: '302',
              navn: '§ 11-27',
            },
            {
              id: '303',
              navn: '§ 11-28',
            },
            {
              id: '304',
              navn: '§ 11-29',
            },
            {
              id: '305',
              navn: '§ 11-31 første ledd',
            },
            {
              id: '306',
              navn: '§ 11-31 andre ledd',
            },
            {
              id: '307',
              navn: '§ 11-31 tredje og fjerde ledd',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '267',
              navn: '§ 22-13 femte ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
            {
              id: '331',
              navn: 'Gamle kapittel 11',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '311',
              navn: 'art. 3',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '313',
              navn: 'art. 21',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '314',
              navn: 'art. 12',
            },
            {
              id: '315',
              navn: 'art. 14 følgende',
            },
          ],
        },
        {
          lovkilde: {
            id: '40',
            navn: 'Arbeidsmarkedsloven',
            beskrivelse: 'Arbeidsmarkedsloven',
          },
          registreringshjemler: [
            {
              id: 'ARBML_2',
              navn: '§ 2',
            },
          ],
        },
        {
          lovkilde: {
            id: '62',
            navn: 'Spesiell lovkilde',
            beskrivelse: 'Spesiell lovkilde',
          },
          registreringshjemler: [
            {
              id: 'SPESIELL_LOVKILDE_A',
              navn: 'Ettergivelse på ulovfestet grunnlag',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4404',
          navn: 'Nav Arbeid og ytelser Hamar',
        },
        {
          id: '4405',
          navn: 'Nav Arbeid og ytelser Innlandet',
        },
        {
          id: '4411',
          navn: 'Nav Arbeid og ytelser Karmøy',
        },
        {
          id: '4402',
          navn: 'Nav Arbeid og ytelser Romerike',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4407',
          navn: 'Nav Arbeid og ytelser Tønsberg',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '0101',
          navn: 'Nav Halden-Aremark',
        },
        {
          id: '0104',
          navn: 'Nav Moss',
        },
        {
          id: '0105',
          navn: 'Nav Sarpsborg',
        },
        {
          id: '0106',
          navn: 'Nav Fredrikstad',
        },
        {
          id: '0111',
          navn: 'Nav Hvaler',
        },
        {
          id: '0119',
          navn: 'Nav Skiptvet Marker',
        },
        {
          id: '0124',
          navn: 'Nav Indre Østfold',
        },
        {
          id: '0127',
          navn: 'Nav Skiptvet',
        },
        {
          id: '0128',
          navn: 'Nav Rakkestad',
        },
        {
          id: '0135',
          navn: 'Nav Råde',
        },
        {
          id: '0137',
          navn: 'Nav Våler i Viken',
        },
        {
          id: '1037',
          navn: 'Nav Lister',
        },
        {
          id: '0211',
          navn: 'Nav Vestby',
        },
        {
          id: '0213',
          navn: 'Nav Nordre Follo',
        },
        {
          id: '0214',
          navn: 'Nav Ås',
        },
        {
          id: '0215',
          navn: 'Nav Frogn',
        },
        {
          id: '0216',
          navn: 'Nav Nesodden',
        },
        {
          id: '0219',
          navn: 'Nav Bærum',
        },
        {
          id: '0220',
          navn: 'Nav Asker',
        },
        {
          id: '0221',
          navn: 'Nav Aurskog-Høland',
        },
        {
          id: '0228',
          navn: 'Nav Rælingen',
        },
        {
          id: '0229',
          navn: 'Nav Enebakk',
        },
        {
          id: '0230',
          navn: 'Nav Lørenskog',
        },
        {
          id: '0231',
          navn: 'Nav Lillestrøm',
        },
        {
          id: '0233',
          navn: 'Nav Nittedal',
        },
        {
          id: '0234',
          navn: 'Nav Gjerdrum',
        },
        {
          id: '0235',
          navn: 'Nav Ullensaker',
        },
        {
          id: '0236',
          navn: 'Nav Nes i Akershus',
        },
        {
          id: '0237',
          navn: 'Nav Eidsvoll',
        },
        {
          id: '0238',
          navn: 'Nav Nannestad Gjerdrum',
        },
        {
          id: '0239',
          navn: 'Nav Hurdal',
        },
        {
          id: '0283',
          navn: 'Nav egne ansatte Øst-Viken',
        },
        {
          id: '0312',
          navn: 'Nav Frogner',
        },
        {
          id: '0313',
          navn: 'Nav St. Hanshaugen',
        },
        {
          id: '0314',
          navn: 'Nav Sagene',
        },
        {
          id: '0315',
          navn: 'Nav Grünerløkka',
        },
        {
          id: '0316',
          navn: 'Nav Gamle Oslo',
        },
        {
          id: '0318',
          navn: 'Nav Nordstrand',
        },
        {
          id: '0319',
          navn: 'Nav Søndre Nordstrand',
        },
        {
          id: '0321',
          navn: 'Nav Østensjø',
        },
        {
          id: '0326',
          navn: 'Nav Alna',
        },
        {
          id: '0327',
          navn: 'Nav Stovner',
        },
        {
          id: '0328',
          navn: 'Nav Grorud',
        },
        {
          id: '0330',
          navn: 'Nav Bjerke',
        },
        {
          id: '0331',
          navn: 'Nav Nordre Aker',
        },
        {
          id: '0334',
          navn: 'Nav Vestre Aker',
        },
        {
          id: '0335',
          navn: 'Nav Ullern',
        },
        {
          id: '0383',
          navn: 'Nav egne ansatte Oslo',
        },
        {
          id: '0393',
          navn: 'Nav Utland og fellestjenester Oslo',
        },
        {
          id: '0402',
          navn: 'Nav Kongsvinger',
        },
        {
          id: '0403',
          navn: 'Nav Hamar',
        },
        {
          id: '0412',
          navn: 'Nav Ringsaker',
        },
        {
          id: '0415',
          navn: 'Nav Løten',
        },
        {
          id: '0417',
          navn: 'Nav Stange',
        },
        {
          id: '0418',
          navn: 'Nav Nord-Odal',
        },
        {
          id: '0420',
          navn: 'Nav Eidskog',
        },
        {
          id: '0423',
          navn: 'Nav Grue',
        },
        {
          id: '0425',
          navn: 'Nav Åsnes',
        },
        {
          id: '0426',
          navn: 'Nav Våler i Hedmark',
        },
        {
          id: '0427',
          navn: 'Nav Elverum',
        },
        {
          id: '0428',
          navn: 'Nav Trysil',
        },
        {
          id: '0429',
          navn: 'Nav Åmot',
        },
        {
          id: '0430',
          navn: 'Nav Stor-Elvdal',
        },
        {
          id: '0434',
          navn: 'Nav Engerdal',
        },
        {
          id: '0437',
          navn: 'Nav Nord-Østerdal',
        },
        {
          id: '0439',
          navn: 'Nav Folldal',
        },
        {
          id: '0476',
          navn: 'Nav Sykefraværssenter Hamarregionen',
        },
        {
          id: '0450',
          navn: 'ENHET FOR ARBEIDSGIVER- OG ARBEIDSTAKERREGISTERET',
        },
        {
          id: '0483',
          navn: 'Nav egne ansatte Innlandet',
        },
        {
          id: '0491',
          navn: 'Nav Arbeidslivssenter Innlandet',
        },
        {
          id: '0501',
          navn: 'Nav Lillehammer-Gausdal',
        },
        {
          id: '0502',
          navn: 'Nav Gjøvik',
        },
        {
          id: '0511',
          navn: 'Nav Lesja - Dovre',
        },
        {
          id: '0513',
          navn: 'Nav Lom-Skjåk',
        },
        {
          id: '0515',
          navn: 'Nav Vågå',
        },
        {
          id: '0516',
          navn: 'Nav Midt-Gudbrandsdal',
        },
        {
          id: '0517',
          navn: 'Nav Sel',
        },
        {
          id: '0519',
          navn: 'Nav Sør-Fron',
        },
        {
          id: '0521',
          navn: 'Nav Øyer',
        },
        {
          id: '0528',
          navn: 'Nav Østre Toten',
        },
        {
          id: '0529',
          navn: 'Nav Vestre Toten',
        },
        {
          id: '0532',
          navn: 'Nav Jevnaker',
        },
        {
          id: '0534',
          navn: 'Nav Hadeland',
        },
        {
          id: '0536',
          navn: 'Nav Søndre Land',
        },
        {
          id: '0538',
          navn: 'Nav Nordre Land',
        },
        {
          id: '0542',
          navn: 'Nav Valdres',
        },
        {
          id: '0602',
          navn: 'Nav Drammen',
        },
        {
          id: '0604',
          navn: 'Nav Kongsberg',
        },
        {
          id: '0605',
          navn: 'Nav Ringerike',
        },
        {
          id: '0612',
          navn: 'Nav Hole',
        },
        {
          id: '0617',
          navn: 'Nav Hallingdal',
        },
        {
          id: '0621',
          navn: 'Nav Sigdal',
        },
        {
          id: '0622',
          navn: 'Nav Krødsherad',
        },
        {
          id: '0623',
          navn: 'Nav Midt-Buskerud',
        },
        {
          id: '0624',
          navn: 'Nav Øvre Eiker',
        },
        {
          id: '0626',
          navn: 'Nav Lier',
        },
        {
          id: '0632',
          navn: 'Nav Numedal',
        },
        {
          id: '0683',
          navn: 'Nav egne ansatte Vest-Viken',
        },
        {
          id: '0701',
          navn: 'Nav Horten',
        },
        {
          id: '0704',
          navn: 'Nav Tønsberg',
        },
        {
          id: '0710',
          navn: 'Nav Sandefjord',
        },
        {
          id: '5301',
          navn: 'Nav Holmestrand',
        },
        {
          id: '5303',
          navn: 'Nav Larvik',
        },
        {
          id: '5302',
          navn: 'Nav Færder',
        },
        {
          id: '0805',
          navn: 'Nav Porsgrunn',
        },
        {
          id: '0806',
          navn: 'Nav Skien',
        },
        {
          id: '0807',
          navn: 'Nav Notodden',
        },
        {
          id: '0811',
          navn: 'Nav Siljan',
        },
        {
          id: '0814',
          navn: 'Nav Bamble',
        },
        {
          id: '0815',
          navn: 'Nav Kragerø',
        },
        {
          id: '0817',
          navn: 'Nav Drangedal',
        },
        {
          id: '0821',
          navn: 'Nav Midt-Telemark',
        },
        {
          id: '0826',
          navn: 'Nav Tinn',
        },
        {
          id: '0833',
          navn: 'Nav Vest-Telemark',
        },
        {
          id: '0883',
          navn: 'Nav egne ansatte Vestfold og Telemark',
        },
        {
          id: '0904',
          navn: 'Nav Grimstad',
        },
        {
          id: '0906',
          navn: 'Nav Arendal',
        },
        {
          id: '0901',
          navn: 'Nav Risør',
        },
        {
          id: '0911',
          navn: 'Nav Gjerstad',
        },
        {
          id: '0914',
          navn: 'Nav Øst i Agder',
        },
        {
          id: '0919',
          navn: 'Nav Froland',
        },
        {
          id: '0928',
          navn: 'Nav Birkenes',
        },
        {
          id: '0929',
          navn: 'Nav Åmli',
        },
        {
          id: '0937',
          navn: 'Nav Evje og Hornnes',
        },
        {
          id: '0926',
          navn: 'Nav Lillesand',
        },
        {
          id: '1001',
          navn: 'Nav Kristiansand',
        },
        {
          id: '1002',
          navn: 'Nav Lindesnes',
        },
        {
          id: '1014',
          navn: 'Nav Midt-Agder',
        },
        {
          id: '1004',
          navn: 'Nav Flekkefjord',
        },
        {
          id: '1032',
          navn: 'Nav Lyngdal',
        },
        {
          id: '1034',
          navn: 'Nav Hægebostad',
        },
        {
          id: '1046',
          navn: 'Nav Sirdal',
        },
        {
          id: '1083',
          navn: 'Nav egne ansatte Agder',
        },
        {
          id: '1101',
          navn: 'Nav Dalane',
        },
        {
          id: '1102',
          navn: 'Nav Sandnes',
        },
        {
          id: '1106',
          navn: 'Nav Haugesund-Utsira',
        },
        {
          id: '1111',
          navn: 'Nav Sokndal',
        },
        {
          id: '1112',
          navn: 'Nav Lund',
        },
        {
          id: '1119',
          navn: 'Nav Hå',
        },
        {
          id: '1120',
          navn: 'Nav Klepp-Time',
        },
        {
          id: '1122',
          navn: 'Nav Gjesdal',
        },
        {
          id: '1124',
          navn: 'Nav Sola',
        },
        {
          id: '1127',
          navn: 'Nav Randaberg-Kvitsøy',
        },
        {
          id: '1130',
          navn: 'Nav Strand',
        },
        {
          id: '1133',
          navn: 'Nav Hjelmeland',
        },
        {
          id: '1134',
          navn: 'Nav Suldal',
        },
        {
          id: '1135',
          navn: 'Nav Sauda',
        },
        {
          id: '1146',
          navn: 'Nav Tysvær',
        },
        {
          id: '1149',
          navn: 'Nav Karmøy-Bokn',
        },
        {
          id: '1160',
          navn: 'Nav Vindafjord-Etne',
        },
        {
          id: '1161',
          navn: 'Nav Eiganes og Tasta',
        },
        {
          id: '1162',
          navn: 'Nav Hundvåg og Storhaug',
        },
        {
          id: '1164',
          navn: 'Nav Hillevåg og Hinna',
        },
        {
          id: '1165',
          navn: 'Nav Madla',
        },
        {
          id: '1169',
          navn: 'Nav Rennesøy og Finnøy',
        },
        {
          id: '1183',
          navn: 'Nav egne ansatte Rogaland',
        },
        {
          id: '1202',
          navn: 'Nav Bergen sør',
        },
        {
          id: '1203',
          navn: 'Nav Bergen nord',
        },
        {
          id: '1204',
          navn: 'Nav Arna',
        },
        {
          id: '1205',
          navn: 'Nav Fyllingsdalen',
        },
        {
          id: '1206',
          navn: 'Nav Bergen vest',
        },
        {
          id: '1208',
          navn: 'Nav Årstad',
        },
        {
          id: '1209',
          navn: 'Nav Bergenhus',
        },
        {
          id: '1210',
          navn: 'Nav Ytrebygda',
        },
        {
          id: '1211',
          navn: 'Nav Etne',
        },
        {
          id: '1216',
          navn: 'Nav Sveio',
        },
        {
          id: '1219',
          navn: 'Nav Bømlo',
        },
        {
          id: '1221',
          navn: 'Nav Stord',
        },
        {
          id: '1222',
          navn: 'Nav Fitjar',
        },
        {
          id: '1223',
          navn: 'Nav Tysnes',
        },
        {
          id: '1224',
          navn: 'Nav Kvinnherad',
        },
        {
          id: '1228',
          navn: 'Nav Ullensvang',
        },
        {
          id: '1232',
          navn: 'Nav Eidfjord',
        },
        {
          id: '1233',
          navn: 'Nav Ulvik',
        },
        {
          id: '1235',
          navn: 'Nav Voss',
        },
        {
          id: '1238',
          navn: 'Nav Kvam',
        },
        {
          id: '1242',
          navn: 'Nav Samnanger',
        },
        {
          id: '1243',
          navn: 'Nav Bjørnafjorden',
        },
        {
          id: '1244',
          navn: 'Nav Austevoll',
        },
        {
          id: '1246',
          navn: 'Nav Øygarden',
        },
        {
          id: '1247',
          navn: 'Nav Askøy',
        },
        {
          id: '1251',
          navn: 'Nav Vaksdal',
        },
        {
          id: '1253',
          navn: 'Nav Osterøy',
        },
        {
          id: '1263',
          navn: 'Nav Alver',
        },
        {
          id: '1266',
          navn: 'Nav Fensfjorden',
        },
        {
          id: '1283',
          navn: 'Nav egne ansatte Vestland',
        },
        {
          id: '1401',
          navn: 'Nav Kinn',
        },
        {
          id: '1412',
          navn: 'Nav Solund',
        },
        {
          id: '1413',
          navn: 'Nav Hyllestad',
        },
        {
          id: '1416',
          navn: 'Nav Høyanger',
        },
        {
          id: '1417',
          navn: 'Nav Vik',
        },
        {
          id: '1420',
          navn: 'Nav Sogndal',
        },
        {
          id: '1421',
          navn: 'Nav Aurland',
        },
        {
          id: '1422',
          navn: 'Nav Lærdal',
        },
        {
          id: '1424',
          navn: 'Nav Årdal',
        },
        {
          id: '1426',
          navn: 'Nav Luster',
        },
        {
          id: '1428',
          navn: 'Nav Askvoll',
        },
        {
          id: '1429',
          navn: 'Nav Fjaler',
        },
        {
          id: '1432',
          navn: 'Nav Sunnfjord',
        },
        {
          id: '1438',
          navn: 'Nav Bremanger',
        },
        {
          id: '1443',
          navn: 'Nav Stad',
        },
        {
          id: '1445',
          navn: 'Nav Gloppen',
        },
        {
          id: '1449',
          navn: 'Nav Stryn',
        },
        {
          id: '1502',
          navn: 'Nav Molde',
        },
        {
          id: '1504',
          navn: 'Nav Ålesund',
        },
        {
          id: '1505',
          navn: 'Nav Kristiansund',
        },
        {
          id: '1515',
          navn: 'Nav Herøy og Vanylven',
        },
        {
          id: '1517',
          navn: 'Nav Hareid - Ulstein - Sande',
        },
        {
          id: '1520',
          navn: 'Nav Ørsta Volda',
        },
        {
          id: '1525',
          navn: 'Nav Stranda',
        },
        {
          id: '1528',
          navn: 'Nav Sykkylven - Stranda',
        },
        {
          id: '1529',
          navn: 'Nav Fjord',
        },
        {
          id: '1531',
          navn: 'Nav Sula',
        },
        {
          id: '1532',
          navn: 'Nav Giske',
        },
        {
          id: '1535',
          navn: 'Nav Vestnes',
        },
        {
          id: '1539',
          navn: 'Nav Rauma',
        },
        {
          id: '1547',
          navn: 'Nav Aukra',
        },
        {
          id: '1548',
          navn: 'Nav Hustadvika',
        },
        {
          id: '1554',
          navn: 'Nav Averøy',
        },
        {
          id: '1557',
          navn: 'Nav Gjemnes',
        },
        {
          id: '1560',
          navn: 'Nav Tingvoll',
        },
        {
          id: '1563',
          navn: 'Nav Indre Nordmøre',
        },
        {
          id: '1566',
          navn: 'Nav Surnadal',
        },
        {
          id: '1567',
          navn: 'Nav Rindal',
        },
        {
          id: '1572',
          navn: 'Nav Tustna',
        },
        {
          id: '1573',
          navn: 'Nav Smøla',
        },
        {
          id: '1576',
          navn: 'Nav Aure',
        },
        {
          id: '1583',
          navn: 'Nav egne ansatte Møre og Romsdal',
        },
        {
          id: '1607',
          navn: 'Nav Heimdal',
        },
        {
          id: '1612',
          navn: 'Nav Heim',
        },
        {
          id: '1620',
          navn: 'Nav Hitra Frøya',
        },
        {
          id: '1621',
          navn: 'Nav Ørland',
        },
        {
          id: '1624',
          navn: 'Nav Rissa',
        },
        {
          id: '1627',
          navn: 'Nav Bjugn',
        },
        {
          id: '1630',
          navn: 'Nav Nord-Fosen',
        },
        {
          id: '1634',
          navn: 'Nav Oppdal og Rennebu',
        },
        {
          id: '1638',
          navn: 'Nav Orkland',
        },
        {
          id: '1640',
          navn: 'Nav Røros, Os og Holtålen',
        },
        {
          id: '1644',
          navn: 'Nav Holtålen',
        },
        {
          id: '1648',
          navn: 'Nav Midtre Gauldal',
        },
        {
          id: '1653',
          navn: 'Nav Melhus',
        },
        {
          id: '1657',
          navn: 'Nav Skaun',
        },
        {
          id: '1663',
          navn: 'Nav Malvik',
        },
        {
          id: '1683',
          navn: 'Nav egne ansatte Trøndelag',
        },
        {
          id: '1702',
          navn: 'Nav Inn-Trøndelag',
        },
        {
          id: '1703',
          navn: 'Nav Midtre Namdal',
        },
        {
          id: '1718',
          navn: 'Nav Leksvik',
        },
        {
          id: '1719',
          navn: 'Nav Levanger',
        },
        {
          id: '1721',
          navn: 'Nav Verdal',
        },
        {
          id: '1724',
          navn: 'Nav Verran',
        },
        {
          id: '1725',
          navn: 'Nav Namdalseid',
        },
        {
          id: '1729',
          navn: 'Avviklet - Nav Inderøy',
        },
        {
          id: '1736',
          navn: 'Nav Snåsa',
        },
        {
          id: '1738',
          navn: 'Nav Lierne',
        },
        {
          id: '1739',
          navn: 'Nav Røyrvik',
        },
        {
          id: '1740',
          navn: 'Nav Namsskogan',
        },
        {
          id: '1742',
          navn: 'Nav Indre Namdal',
        },
        {
          id: '1743',
          navn: 'Nav Høylandet',
        },
        {
          id: '1744',
          navn: 'Nav Overhalla',
        },
        {
          id: '1748',
          navn: 'Nav Fosnes',
        },
        {
          id: '1749',
          navn: 'Nav Flatanger',
        },
        {
          id: '1750',
          navn: 'Nav Vikna',
        },
        {
          id: '1751',
          navn: 'Nav Nærøysund',
        },
        {
          id: '1755',
          navn: 'Nav Leka',
        },
        {
          id: '1756',
          navn: 'Nav Inderøy',
        },
        {
          id: '1783',
          navn: 'Nav Værnes',
        },
        {
          id: '1804',
          navn: 'Nav Bodø',
        },
        {
          id: '1805',
          navn: 'Nav Narvik',
        },
        {
          id: '1812',
          navn: 'Nav Sømna',
        },
        {
          id: '1813',
          navn: 'Nav Sør-Helgeland',
        },
        {
          id: '1815',
          navn: 'Nav Vega',
        },
        {
          id: '1816',
          navn: 'Nav Vevelstad',
        },
        {
          id: '1818',
          navn: 'Nav Herøy',
        },
        {
          id: '1820',
          navn: 'Nav Ytre Helgeland',
        },
        {
          id: '1822',
          navn: 'Nav Leirfjord',
        },
        {
          id: '1824',
          navn: 'Nav Vefsna',
        },
        {
          id: '1825',
          navn: 'Nav Grane',
        },
        {
          id: '1826',
          navn: 'Nav Hattfjelldal',
        },
        {
          id: '1827',
          navn: 'Nav Dønna',
        },
        {
          id: '1828',
          navn: 'Nav Nesna',
        },
        {
          id: '1832',
          navn: 'Nav Hemnes',
        },
        {
          id: '1833',
          navn: 'Nav Rana',
        },
        {
          id: '1834',
          navn: 'Nav Lurøy',
        },
        {
          id: '1835',
          navn: 'Nav Træna',
        },
        {
          id: '1836',
          navn: 'Nav Rødøy',
        },
        {
          id: '1837',
          navn: 'Nav Meløy',
        },
        {
          id: '1838',
          navn: 'Nav Gildeskål',
        },
        {
          id: '1839',
          navn: 'Nav Beiarn',
        },
        {
          id: '1840',
          navn: 'Nav Saltdal',
        },
        {
          id: '1841',
          navn: 'Nav Indre Salten',
        },
        {
          id: '1845',
          navn: 'Nav Sørfold',
        },
        {
          id: '1848',
          navn: 'Nav Steigen',
        },
        {
          id: '1849',
          navn: 'Nav Hamarøy',
        },
        {
          id: '1850',
          navn: 'Nav Tysfjord',
        },
        {
          id: '1851',
          navn: 'Nav Lødingen',
        },
        {
          id: '1852',
          navn: 'Nav Evenes og Tjeldsund',
        },
        {
          id: '1854',
          navn: 'Nav Ballangen',
        },
        {
          id: '1856',
          navn: 'Nav Røst',
        },
        {
          id: '1857',
          navn: 'Nav Værøy',
        },
        {
          id: '1859',
          navn: 'Nav Flakstad',
        },
        {
          id: '1860',
          navn: 'Nav Lofoten',
        },
        {
          id: '1865',
          navn: 'Nav Svolvær',
        },
        {
          id: '1866',
          navn: 'Nav Hadsel',
        },
        {
          id: '1867',
          navn: 'Nav Bø',
        },
        {
          id: '1868',
          navn: 'Nav Øksnes',
        },
        {
          id: '1870',
          navn: 'Nav Sortland',
        },
        {
          id: '1871',
          navn: 'Nav Andøy',
        },
        {
          id: '1874',
          navn: 'Nav Moskenes',
        },
        {
          id: '1883',
          navn: 'Nav egne ansatte Nordland',
        },
        {
          id: '1902',
          navn: 'Nav Tromsø',
        },
        {
          id: '1903',
          navn: 'Nav Sør-Troms',
        },
        {
          id: '1911',
          navn: 'Nav Kvæfjord',
        },
        {
          id: '1913',
          navn: 'Nav Tjeldsund',
        },
        {
          id: '1917',
          navn: 'Nav Ibestad',
        },
        {
          id: '1919',
          navn: 'Nav Gratangen',
        },
        {
          id: '1920',
          navn: 'Nav Lavangen',
        },
        {
          id: '1922',
          navn: 'Nav Bardu',
        },
        {
          id: '1923',
          navn: 'Nav Salangen-Lavangen-Dyrøy',
        },
        {
          id: '1924',
          navn: 'Nav Målselv-Bardu',
        },
        {
          id: '1925',
          navn: 'Nav Sørreisa',
        },
        {
          id: '1926',
          navn: 'Nav Dyrøy',
        },
        {
          id: '1927',
          navn: 'Nav Tranøy',
        },
        {
          id: '1928',
          navn: 'Nav Torsken',
        },
        {
          id: '1929',
          navn: 'Nav Berg',
        },
        {
          id: '1931',
          navn: 'Nav Senja-Sørreisa',
        },
        {
          id: '1933',
          navn: 'Nav Balsfjord-Storfjord',
        },
        {
          id: '1936',
          navn: 'Nav Karlsøy',
        },
        {
          id: '1938',
          navn: 'Nav Lyngen',
        },
        {
          id: '1939',
          navn: 'Nav Storfjord',
        },
        {
          id: '1940',
          navn: 'Nav Gáivuotna/Kåfjord',
        },
        {
          id: '1941',
          navn: 'Nav Skjervøy',
        },
        {
          id: '1942',
          navn: 'Nav Nordreisa',
        },
        {
          id: '1943',
          navn: 'Nav Kvænangen',
        },
        {
          id: '1983',
          navn: 'Nav egne ansatte Troms og Finnmark',
        },
        {
          id: '2002',
          navn: 'Nav Vardø',
        },
        {
          id: '2003',
          navn: 'Nav Vadsø',
        },
        {
          id: '2004',
          navn: 'Nav Hammerfest-Måsøy',
        },
        {
          id: '2011',
          navn: 'Nav Guovdageaidnu/Kautokeino',
        },
        {
          id: '2012',
          navn: 'Nav Alta-Kvænangen-Loppa',
        },
        {
          id: '2014',
          navn: 'Nav Loppa',
        },
        {
          id: '2015',
          navn: 'Nav Hasvik',
        },
        {
          id: '2017',
          navn: 'Nav Kvalsund',
        },
        {
          id: '2018',
          navn: 'Nav Måsøy',
        },
        {
          id: '2019',
          navn: 'Nav Nordkapp',
        },
        {
          id: '2020',
          navn: 'Nav Porsanger',
        },
        {
          id: '2021',
          navn: 'Nav Karasjohka/Karasjok',
        },
        {
          id: '2022',
          navn: 'Nav Lebesby',
        },
        {
          id: '2023',
          navn: 'Nav Gamvik',
        },
        {
          id: '2024',
          navn: 'Nav Berlevåg',
        },
        {
          id: '2025',
          navn: 'Nav Deatnu/Tana',
        },
        {
          id: '2027',
          navn: 'Nav Unjárga/Nesseby',
        },
        {
          id: '2028',
          navn: 'Nav Båtsfjord',
        },
        {
          id: '2030',
          navn: 'Nav Sør-Varanger',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
        {
          id: '5701',
          navn: 'Nav Falkenborg',
        },
        {
          id: '5702',
          navn: 'Nav Lerkendal',
        },
        {
          id: '5703',
          navn: 'Nav Indre Fosen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_KAPITTEL_2',
          navn: 'Ftrl - Kapittel 2',
          beskrivelse: 'Folketrygdloven - Kapittel 2',
        },
        {
          id: 'FTRL_21_12_FVL_31',
          navn: 'Ftrl - § 21-12 / fvl § 31',
          beskrivelse: 'Folketrygdloven - § 21-12 / fvl § 31',
        },
        {
          id: 'EOES_883_2004',
          navn: 'EØS forordning 883/2004 - EØS forordning 883/2004',
          beskrivelse: 'EØS forordning 883/2004 - EØS forordning 883/2004',
        },
        {
          id: 'FTRL_11_2',
          navn: 'Ftrl - § 11-2',
          beskrivelse: 'Folketrygdloven - § 11-2',
        },
        {
          id: 'FTRL_11_3',
          navn: 'Ftrl - § 11-3',
          beskrivelse: 'Folketrygdloven - § 11-3',
        },
        {
          id: 'FTRL_11_4',
          navn: 'Ftrl - § 11-4',
          beskrivelse: 'Folketrygdloven - § 11-4',
        },
        {
          id: 'FTRL_11_5',
          navn: 'Ftrl - § 11-5',
          beskrivelse: 'Folketrygdloven - § 11-5',
        },
        {
          id: 'FTRL_11_6',
          navn: 'Ftrl - § 11-6',
          beskrivelse: 'Folketrygdloven - § 11-6',
        },
        {
          id: 'FTRL_11_7_11_8_11_9',
          navn: 'Ftrl - §§ 11-7 / 11-8 / 11-9',
          beskrivelse: 'Folketrygdloven - §§ 11-7 / 11-8 / 11-9',
        },
        {
          id: 'FTRL_11_10',
          navn: 'Ftrl - § 11-10',
          beskrivelse: 'Folketrygdloven - § 11-10',
        },
        {
          id: 'FTRL_11_12',
          navn: 'Ftrl - § 11-12',
          beskrivelse: 'Folketrygdloven - § 11-12',
        },
        {
          id: 'FTRL_11_13',
          navn: 'Ftrl - § 11-13',
          beskrivelse: 'Folketrygdloven - § 11-13',
        },
        {
          id: 'FTRL_11_14',
          navn: 'Ftrl - § 11-14',
          beskrivelse: 'Folketrygdloven - § 11-14',
        },
        {
          id: 'FTRL_11_15',
          navn: 'Ftrl - § 11-15',
          beskrivelse: 'Folketrygdloven - § 11-15',
        },
        {
          id: 'FTRL_11_17',
          navn: 'Ftrl - § 11-17',
          beskrivelse: 'Folketrygdloven - § 11-17',
        },
        {
          id: 'FTRL_11_18',
          navn: 'Ftrl - § 11-18',
          beskrivelse: 'Folketrygdloven - § 11-18',
        },
        {
          id: 'FTRL_11_19_11_20',
          navn: 'Ftrl - §§ 11-19 / 11-20',
          beskrivelse: 'Folketrygdloven - §§ 11-19 / 11-20',
        },
        {
          id: 'FTRL_11_22',
          navn: 'Ftrl - § 11-22',
          beskrivelse: 'Folketrygdloven - § 11-22',
        },
        {
          id: 'FTRL_11_23',
          navn: 'Ftrl - § 11-23',
          beskrivelse: 'Folketrygdloven - § 11-23',
        },
        {
          id: 'FTRL_11_24',
          navn: 'Ftrl - § 11-24',
          beskrivelse: 'Folketrygdloven - § 11-24',
        },
        {
          id: 'FTRL_11_25',
          navn: 'Ftrl - § 11-25',
          beskrivelse: 'Folketrygdloven - § 11-25',
        },
        {
          id: 'FTRL_11_26',
          navn: 'Ftrl - § 11-26',
          beskrivelse: 'Folketrygdloven - § 11-26',
        },
        {
          id: 'FTRL_11_27_11_28',
          navn: 'Ftrl - §§ 11-27 / 11-28',
          beskrivelse: 'Folketrygdloven - §§ 11-27 / 11-28',
        },
        {
          id: 'FTRL_11_29',
          navn: 'Ftrl - § 11-29',
          beskrivelse: 'Folketrygdloven - § 11-29',
        },
        {
          id: 'FTRL_11_31',
          navn: 'Ftrl - § 11-31',
          beskrivelse: 'Folketrygdloven - § 11-31',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'TRRL_9_FVL_31',
          navn: 'Trrl - § 9 / fvl § 31',
          beskrivelse: 'Trygderettsloven - § 9 / fvl § 31',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'TRRL_27',
          navn: 'Trrl - § 27',
          beskrivelse: 'Trygderettsloven - § 27',
        },
      ],
    },
    {
      id: '27',
      navn: 'Avtalefestet pensjon (AFP)',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '43',
            navn: 'AFP-62 Privat',
            beskrivelse: 'AFP-62 Privat',
          },
          registreringshjemler: [
            {
              id: '750',
              navn: 'AFP-62 Privat',
            },
          ],
        },
        {
          lovkilde: {
            id: '44',
            navn: 'AFP-62 Offentlig',
            beskrivelse: 'AFP-62 Offentlig',
          },
          registreringshjemler: [
            {
              id: '751',
              navn: 'AFP-62 Offentlig',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: 'FTRL_22_15_TILBAKEKREVING',
              navn: '§ 22-15 Tilbakekreving',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4808',
          navn: 'Nav Familie- og pensjonsytelser Porsgrunn',
        },
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '0001',
          navn: 'Nav Pensjon Utland',
        },
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '4862',
          navn: 'Nav Familie- og pensjonsytelser utland Ålesund',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'AFP_PRIVAT',
          navn: 'AFP-62 Privat - AFP Privat',
          beskrivelse: 'AFP-62 Privat - AFP Privat',
        },
        {
          id: 'AFP_62_OFFENTLIG_ETTEROPPGJOER',
          navn: 'AFP-62 Offentlig - AFP-62 Offentlig - etteroppgjør',
          beskrivelse: 'AFP-62 Offentlig - AFP-62 Offentlig - etteroppgjør',
        },
        {
          id: 'AFP_62_OFFENTLIG_ANNET',
          navn: 'AFP-62 Offentlig - AFP-62 Offentlig - annet',
          beskrivelse: 'AFP-62 Offentlig - AFP-62 Offentlig - annet',
        },
      ],
    },
    {
      id: '26',
      navn: 'Barnepensjon',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '418',
              navn: '§ 2-5',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '487',
              navn: '§ 3-3',
            },
            {
              id: '488',
              navn: '§ 3-5',
            },
            {
              id: '489',
              navn: '§ 3-7',
            },
            {
              id: '503',
              navn: '§ 3-23',
            },
            {
              id: '573',
              navn: '§ 18-2',
            },
            {
              id: '574',
              navn: '§ 18-3',
            },
            {
              id: '575',
              navn: '§ 18-4 stønadsperiode',
            },
            {
              id: '576',
              navn: '§ 18-5 beregning',
            },
            {
              id: '577',
              navn: '§ 18-6',
            },
            {
              id: '578',
              navn: '§ 18-7',
            },
            {
              id: '579',
              navn: '§ 18-8',
            },
            {
              id: '580',
              navn: '§ 18-9',
            },
            {
              id: 'FTRL_18_10',
              navn: '§ 18-10',
            },
            {
              id: '581',
              navn: '§ 18-11 - Før 01.01.2024',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '530',
              navn: 'art. 1',
            },
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '379',
              navn: 'art. 50',
            },
            {
              id: '380',
              navn: 'art. 51',
            },
            {
              id: '381',
              navn: 'art. 52',
            },
            {
              id: '531',
              navn: 'art. 53',
            },
            {
              id: '532',
              navn: 'art. 54',
            },
            {
              id: '533',
              navn: 'art. 55',
            },
            {
              id: '534',
              navn: 'art. 56',
            },
            {
              id: '382',
              navn: 'art. 57',
            },
            {
              id: '383',
              navn: 'art. 58',
            },
            {
              id: '535',
              navn: 'art. 59',
            },
            {
              id: '536',
              navn: 'art. 60',
            },
            {
              id: '385',
              navn: 'art. 70',
            },
            {
              id: '386',
              navn: 'art. 87',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '537',
              navn: 'art. 10',
            },
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '314',
              navn: 'art. 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '20',
            navn: 'Forordning 1408/71',
            beskrivelse: 'Forordning 1408/71',
          },
          registreringshjemler: [
            {
              id: '395',
              navn: 'Forordning 1408/71',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '23',
            navn: 'Trygdeavtaler med England',
            beskrivelse: 'Trygdeavtaler med England',
          },
          registreringshjemler: [
            {
              id: '539',
              navn: 'Trygdeavtaler med England',
            },
          ],
        },
        {
          lovkilde: {
            id: '24',
            navn: 'Trygdeavtaler med USA',
            beskrivelse: 'Trygdeavtaler med USA',
          },
          registreringshjemler: [
            {
              id: '540',
              navn: 'Trygdeavtaler med USA',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4808',
          navn: 'Nav Familie- og pensjonsytelser Porsgrunn',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '4862',
          navn: 'Nav Familie- og pensjonsytelser utland Ålesund',
        },
        {
          id: '0001',
          navn: 'Nav Pensjon Utland',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_18_2',
          navn: 'Ftrl - § 18-2',
          beskrivelse: 'Folketrygdloven - § 18-2',
        },
        {
          id: 'FTRL_18_3',
          navn: 'Ftrl - § 18-3',
          beskrivelse: 'Folketrygdloven - § 18-3',
        },
        {
          id: 'FTRL_18_4',
          navn: 'Ftrl - § 18-4 stønadsperiode',
          beskrivelse: 'Folketrygdloven - § 18-4 stønadsperiode',
        },
        {
          id: 'FTRL_18_5',
          navn: 'Ftrl - § 18-5 beregning',
          beskrivelse: 'Folketrygdloven - § 18-5 beregning',
        },
        {
          id: 'FTRL_18_6',
          navn: 'Ftrl - § 18-6',
          beskrivelse: 'Folketrygdloven - § 18-6',
        },
        {
          id: 'FTRL_18_7',
          navn: 'Ftrl - § 18-7',
          beskrivelse: 'Folketrygdloven - § 18-7',
        },
        {
          id: 'FTRL_18_8',
          navn: 'Ftrl - § 18-8',
          beskrivelse: 'Folketrygdloven - § 18-8',
        },
        {
          id: 'FTRL_18_9',
          navn: 'Ftrl - § 18-9',
          beskrivelse: 'Folketrygdloven - § 18-9',
        },
        {
          id: 'FTRL_18_10',
          navn: 'Ftrl - § 18-10',
          beskrivelse: 'Folketrygdloven - § 18-10',
        },
        {
          id: 'FTRL_18_11_YRKESSKADE_GAMMEL',
          navn: 'Ftrl - § 18-11 yrkesskade før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 18-11 yrkesskade før 01.01.2024',
        },
        {
          id: 'FTRL_2_1',
          navn: 'Ftrl - § 2-1',
          beskrivelse: 'Folketrygdloven - § 2-1',
        },
        {
          id: 'FTRL_2_2',
          navn: 'Ftrl - § 2-2',
          beskrivelse: 'Folketrygdloven - § 2-2',
        },
        {
          id: 'FTRL_2_5',
          navn: 'Ftrl - § 2-5',
          beskrivelse: 'Folketrygdloven - § 2-5',
        },
        {
          id: 'FTRL_2_13',
          navn: 'Ftrl - § 2-13',
          beskrivelse: 'Folketrygdloven - § 2-13',
        },
        {
          id: 'FTRL_2_14',
          navn: 'Ftrl - § 2-14',
          beskrivelse: 'Folketrygdloven - § 2-14',
        },
        {
          id: 'FTRL_3_3',
          navn: 'Ftrl - § 3-3',
          beskrivelse: 'Folketrygdloven - § 3-3',
        },
        {
          id: 'FTRL_3_5_TRYGDETID',
          navn: 'Ftrl - § 3-5 (trygdetid)',
          beskrivelse: 'Folketrygdloven - § 3-5 (trygdetid)',
        },
        {
          id: 'FTRL_3_7',
          navn: 'Ftrl - § 3-7',
          beskrivelse: 'Folketrygdloven - § 3-7',
        },
        {
          id: 'FTRL_3_23',
          navn: 'Ftrl - § 3-23',
          beskrivelse: 'Folketrygdloven - § 3-23',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_6',
          navn: 'Ftrl - § 21-6',
          beskrivelse: 'Folketrygdloven - § 21-6',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FTRL_22_7',
          navn: 'Ftrl - § 22-7',
          beskrivelse: 'Folketrygdloven - § 22-7',
        },
        {
          id: 'FTRL_22_8',
          navn: 'Ftrl - § 22-8',
          beskrivelse: 'Folketrygdloven - § 22-8',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_15_1_1',
          navn: 'Ftrl - § 22-15 1. ledd 1. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 1. pkt.',
        },
        {
          id: 'FTRL_22_15_1_2',
          navn: 'Ftrl - § 22-15 1. ledd 2. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 2. pkt.',
        },
        {
          id: 'FTRL_22_15_2',
          navn: 'Ftrl - § 22-15 2. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 2. ledd',
        },
        {
          id: 'FTRL_22_15_4',
          navn: 'Ftrl - § 22-15 4. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 4. ledd',
        },
        {
          id: 'FTRL_22_15_5',
          navn: 'Ftrl - § 22-15 5. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 5. ledd',
        },
        {
          id: 'FTRL_22_15_6',
          navn: 'Ftrl - § 22-15 6. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 6. ledd',
        },
        {
          id: 'FTRL_22_16',
          navn: 'Ftrl - § 22-16',
          beskrivelse: 'Folketrygdloven - § 22-16',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_36',
          navn: 'Fvl - § 36',
          beskrivelse: 'Forvaltningsloven - § 36',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
        {
          id: 'EOES_AVTALEN_BEREGNING',
          navn: 'EØS-avtalen - EØS-avtalen - beregning',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - beregning',
        },
        {
          id: 'EOES_AVTALEN_MEDLEMSKAP_TRYGDETID',
          navn: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
        },
      ],
    },
    {
      id: '10',
      navn: 'Barnetrygd',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '29',
            navn: 'Barnetrygdloven',
            beskrivelse: 'Btrl',
          },
          registreringshjemler: [
            {
              id: '619',
              navn: '§ 2',
            },
            {
              id: 'BTRL_2_3',
              navn: '§ 2 tredje ledd (delt bosted)',
            },
            {
              id: '586',
              navn: '§ 3',
            },
            {
              id: '587',
              navn: '§ 4',
            },
            {
              id: 'BTRL_4_2',
              navn: '§ 4 andre ledd (lovlig opphold)',
            },
            {
              id: 'BTRL_4_3',
              navn: '§ 4 tredje ledd (opphold mer enn tre måneder)',
            },
            {
              id: '588',
              navn: '§ 5',
            },
            {
              id: '589',
              navn: '§ 6',
            },
            {
              id: '590',
              navn: '§ 7',
            },
            {
              id: '591',
              navn: '§ 8',
            },
            {
              id: '592',
              navn: '§ 9',
            },
            {
              id: '593',
              navn: '§ 10',
            },
            {
              id: '594',
              navn: '§ 11',
            },
            {
              id: '595',
              navn: '§ 12',
            },
            {
              id: '596',
              navn: '§ 13',
            },
            {
              id: 'BTRL_13_1_2',
              navn: '§ 13 første ledd andre punkt',
            },
            {
              id: 'BTRL_13_1_3',
              navn: '§ 13 første ledd tredje punkt',
            },
            {
              id: 'BTRL_13_2',
              navn: '§ 13 andre ledd',
            },
            {
              id: '597',
              navn: '§ 14',
            },
            {
              id: '598',
              navn: '§ 15',
            },
            {
              id: '599',
              navn: '§ 16',
            },
            {
              id: '600',
              navn: '§ 17',
            },
            {
              id: 'BTRL_22',
              navn: '§ 22',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '30',
            navn: 'EØS-avtalen',
            beskrivelse: 'EØS-avtalen',
          },
          registreringshjemler: [
            {
              id: '601',
              navn: 'EØS-avtalen',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '602',
              navn: 'art. 14',
            },
            {
              id: '603',
              navn: 'art. 15',
            },
            {
              id: '604',
              navn: 'art. 16',
            },
            {
              id: '605',
              navn: 'art. 67',
            },
            {
              id: '620',
              navn: 'art. 68',
            },
            {
              id: '384',
              navn: 'art. 69',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '607',
              navn: 'art. 14',
            },
            {
              id: '662',
              navn: 'art. 58',
            },
            {
              id: '663',
              navn: 'art. 59',
            },
            {
              id: '664',
              navn: 'art. 60',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
            {
              id: 'TRRL_29',
              navn: '§ 28',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4820',
          navn: 'Nav Familie- og pensjonsytelser Vadsø',
        },
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4842',
          navn: 'Nav Familie- og pensjonsytelser Stord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '619',
          navn: 'Btrl - § 2',
          beskrivelse: 'Barnetrygdloven - § 2',
        },
        {
          id: '587',
          navn: 'Btrl - § 4',
          beskrivelse: 'Barnetrygdloven - § 4',
        },
        {
          id: '588',
          navn: 'Btrl - § 5',
          beskrivelse: 'Barnetrygdloven - § 5',
        },
        {
          id: '592',
          navn: 'Btrl - § 9',
          beskrivelse: 'Barnetrygdloven - § 9',
        },
        {
          id: 'BTRL_10',
          navn: 'Btrl - § 10',
          beskrivelse: 'Barnetrygdloven - § 10',
        },
        {
          id: 'BTRL_11',
          navn: 'Btrl - § 11',
          beskrivelse: 'Barnetrygdloven - § 11',
        },
        {
          id: 'BTRL_12',
          navn: 'Btrl - § 12',
          beskrivelse: 'Barnetrygdloven - § 12',
        },
        {
          id: '596',
          navn: 'Btrl - § 13',
          beskrivelse: 'Barnetrygdloven - § 13',
        },
        {
          id: 'BTRL_14',
          navn: 'Btrl - § 14',
          beskrivelse: 'Barnetrygdloven - § 14',
        },
        {
          id: 'BTRL_15',
          navn: 'Btrl - § 15',
          beskrivelse: 'Barnetrygdloven - § 15',
        },
        {
          id: 'BTRL_17',
          navn: 'Btrl - § 17',
          beskrivelse: 'Barnetrygdloven - § 17',
        },
        {
          id: 'BTRL_18',
          navn: 'Btrl - § 18',
          beskrivelse: 'Barnetrygdloven - § 18',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: '601',
          navn: 'EØS-avtalen - EØS-avtalen',
          beskrivelse: 'EØS-avtalen - EØS-avtalen',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
      ],
    },
    {
      id: '11',
      navn: 'Bidragsområdet - Barnebidrag',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '32',
            navn: 'Barnelova',
            beskrivelse: 'Bl',
          },
          registreringshjemler: [
            {
              id: 'BL_0_PR_BID',
              navn: '§ 0 Prosjekt bidrag',
            },
            {
              id: '622',
              navn: '§ 7 (farskap)',
            },
            {
              id: 'BL_44',
              navn: '§ 44 (reisekostnader ved samvær)',
            },
            {
              id: '623',
              navn: '§ 66',
            },
            {
              id: '624',
              navn: '§ 67 første ledd',
            },
            {
              id: '625',
              navn: '§ 67 andre ledd (særtilskudd)',
            },
            {
              id: '626',
              navn: '§ 67 tredje ledd',
            },
            {
              id: '628',
              navn: '§ 68 andre ledd (skolegang)',
            },
            {
              id: 'BL_68C',
              navn: '§ 68 tredje ledd (høyere utdanning)',
            },
            {
              id: '629',
              navn: '§ 69',
            },
            {
              id: 'BL_70A_1',
              navn: '§ 70 første ledd',
            },
            {
              id: '631',
              navn: '§ 70 andre ledd siste punktum (gebyr)',
            },
            {
              id: 'BL_70_5',
              navn: '§ 70 femte ledd (eget tiltak - barnets fødsel)',
            },
            {
              id: 'BL_70_6',
              navn: '§ 70 sjette ledd (eget tiltak - barnetillegg)',
            },
            {
              id: 'BL_70_7',
              navn: '§ 70 syvende ledd',
            },
            {
              id: '632',
              navn: '§ 71',
            },
            {
              id: '634',
              navn: '§ 72 første punktum',
            },
            {
              id: '635',
              navn: '§ 72 andre punktum',
            },
            {
              id: 'BL_73',
              navn: '§ 73',
            },
            {
              id: '637',
              navn: '§ 74 første ledd',
            },
            {
              id: 'BL_74_2B',
              navn: '§ 74 andre ledd (ettergivelse)',
            },
            {
              id: '638',
              navn: '§ 74 andre ledd (virkningstidspunkt)',
            },
            {
              id: 'BL_74_5',
              navn: '§ 74 femte ledd (eget tiltak - barnetillegg)',
            },
            {
              id: 'BL_75A',
              navn: '§ 75 første ledd',
            },
            {
              id: 'BL_75B',
              navn: '§ 75 andre ledd',
            },
            {
              id: '640',
              navn: '§ 76',
            },
            {
              id: '641',
              navn: '§ 80',
            },
            {
              id: '821',
              navn: '§ 83',
            },
          ],
        },
        {
          lovkilde: {
            id: '33',
            navn: 'Forskrift om fastsettelse og endring av fostringstilskot',
            beskrivelse: 'Forskrift om fastsetjing av fostringstilskot',
          },
          registreringshjemler: [
            {
              id: '642',
              navn: '§ 2',
            },
            {
              id: 'FS_FASTS_OG_END_3_4',
              navn: '§ 3 fjerde ledd (tilsynsutgifter)',
            },
            {
              id: '643',
              navn: '§ 3 (annet)',
            },
            {
              id: '645',
              navn: '§ 4 første ledd',
            },
            {
              id: 'FS_FASTS_OG_END_4D',
              navn: '§ 4 femte ledd',
            },
            {
              id: '646',
              navn: '§ 4 sjette ledd',
            },
            {
              id: '647',
              navn: '§ 5',
            },
            {
              id: 'FS_FASTS_OG_END_6_1',
              navn: '§ 6 første ledd',
            },
            {
              id: '649',
              navn: '§ 6 tredje ledd (boforhold)',
            },
            {
              id: 'FS_FASTS_OG_END_6_5',
              navn: '§ 6 femte ledd (barn i egen husstand)',
            },
            {
              id: '650',
              navn: '§ 7',
            },
            {
              id: '651',
              navn: '§ 8',
            },
            {
              id: '653',
              navn: '§ 9 første ledd',
            },
            {
              id: '654',
              navn: '§ 9 andre ledd',
            },
            {
              id: '655',
              navn: '§ 9 tredje ledd',
            },
            {
              id: 'FS_FASTS_OG_END_9_4',
              navn: '§ 9 fjerde ledd',
            },
            {
              id: '656',
              navn: '§ 10 første ledd',
            },
            {
              id: '657',
              navn: '§ 10 andre ledd',
            },
            {
              id: '658',
              navn: '§ 11 bokstav a.',
            },
            {
              id: '659',
              navn: '§ 11 bokstav b.',
            },
            {
              id: '660',
              navn: '§ 11 bokstav c.',
            },
            {
              id: '661',
              navn: '§ 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '34',
            navn: 'Forskrift om særtilskudd',
            beskrivelse: 'Forskrift om særtilskot',
          },
          registreringshjemler: [
            {
              id: '665',
              navn: '§ 2',
            },
            {
              id: '666',
              navn: '§ 3',
            },
            {
              id: '667',
              navn: '§ 4',
            },
          ],
        },
        {
          lovkilde: {
            id: '70',
            navn: 'Forskrift om gebyr for offentlig fastsettelse av barnebidrag',
            beskrivelse: 'Forskrift om gebyr for bidragsfastsettelse',
          },
          registreringshjemler: [
            {
              id: 'FS_OM_GEBYR_BIDRAGSFASTSETTELSE_1',
              navn: '§ 1',
            },
            {
              id: 'FS_OM_GEBYR_BIDRAGSFASTSETTELSE_2',
              navn: '§ 2',
            },
            {
              id: 'FS_OM_GEBYR_BIDRAGSFASTSETTELSE_3',
              navn: '§ 3',
            },
          ],
        },
        {
          lovkilde: {
            id: '55',
            navn: 'Forskrift om ettergjeving',
            beskrivelse: 'Forskrift om ettergjeving',
          },
          registreringshjemler: [
            {
              id: '834',
              navn: '§ 1',
            },
            {
              id: '835',
              navn: '§ 2',
            },
            {
              id: '836',
              navn: '§ 3',
            },
            {
              id: '837',
              navn: '§ 4',
            },
          ],
        },
        {
          lovkilde: {
            id: '35',
            navn: 'Forskotteringsloven',
            beskrivelse: 'Forskl',
          },
          registreringshjemler: [
            {
              id: 'FORSKL_3_2',
              navn: '§ 3 andre ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '36',
            navn: 'Bidragsinnkrevingsloven',
            beskrivelse: 'Bidragsinnkrevingsloven',
          },
          registreringshjemler: [
            {
              id: 'INNKL_25_T',
              navn: '§ 25 (tilbakekreving)',
            },
            {
              id: 'INNKL_26A_T',
              navn: '§ 26 første ledd (tilbakekreving)',
            },
            {
              id: 'INNKL_26B_T',
              navn: '§ 26 andre ledd (tilbakekreving)',
            },
            {
              id: 'INNKL_27',
              navn: '§ 27',
            },
            {
              id: 'INNKL_29',
              navn: '§ 29 (tilbakekreving)',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '668',
              navn: '§ 31 første ledd bokstav a',
            },
            {
              id: '669',
              navn: '§ 31 første ledd bokstav b',
            },
            {
              id: '670',
              navn: '§ 31 andre ledd',
            },
            {
              id: '671',
              navn: '§ 31 tredje ledd',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4820',
          navn: 'Nav Familie- og pensjonsytelser Vadsø',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '46',
      navn: 'Bidragsområdet - Barnebortføring',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '51',
            navn: 'Barnebortføringsloven',
            beskrivelse: 'Barnebortføringsloven',
          },
          registreringshjemler: [
            {
              id: '787',
              navn: '§ 2',
            },
            {
              id: '788',
              navn: '§ 3',
            },
            {
              id: '789',
              navn: '§ 4',
            },
            {
              id: '790',
              navn: '§ 5',
            },
            {
              id: '791',
              navn: '§ 6',
            },
            {
              id: '792',
              navn: '§ 7',
            },
            {
              id: '793',
              navn: '§ 8',
            },
            {
              id: '794',
              navn: '§ 9',
            },
            {
              id: '795',
              navn: '§ 10',
            },
            {
              id: '796',
              navn: '§ 11',
            },
            {
              id: '797',
              navn: '§ 12',
            },
            {
              id: '798',
              navn: '§ 13',
            },
            {
              id: '799',
              navn: '§ 14',
            },
            {
              id: '800',
              navn: '§ 15',
            },
            {
              id: '801',
              navn: '§ 16',
            },
            {
              id: '802',
              navn: '§ 17',
            },
            {
              id: '803',
              navn: '§ 18',
            },
            {
              id: '804',
              navn: '§ 19',
            },
            {
              id: '805',
              navn: '§ 20',
            },
          ],
        },
        {
          lovkilde: {
            id: '52',
            navn: 'Konvensjon om sivile sider ved barnebortføring',
            beskrivelse: 'Konvensjon om barnebortføring',
          },
          registreringshjemler: [
            {
              id: '806',
              navn: 'art. 2',
            },
            {
              id: '807',
              navn: 'art. 3',
            },
            {
              id: '808',
              navn: 'art. 4',
            },
            {
              id: '809',
              navn: 'art. 7',
            },
            {
              id: '810',
              navn: 'art. 8',
            },
            {
              id: '811',
              navn: 'art. 12',
            },
            {
              id: '812',
              navn: 'art. 13',
            },
            {
              id: '813',
              navn: 'art. 17',
            },
            {
              id: '814',
              navn: 'art. 24',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '12',
      navn: 'Bidragsområdet - Bidragsforskudd',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '35',
            navn: 'Forskotteringsloven',
            beskrivelse: 'Forskl',
          },
          registreringshjemler: [
            {
              id: 'FORSKL_0_PR_BID',
              navn: '§ 0 Prosjekt bidrag',
            },
            {
              id: '672',
              navn: '§ 2 første ledd bokstav a.',
            },
            {
              id: '673',
              navn: '§ 2 første ledd bokstav b.',
            },
            {
              id: 'FORSKL_3_1',
              navn: '§ 3 første ledd',
            },
            {
              id: 'FORSKL_3_2',
              navn: '§ 3 andre ledd',
            },
            {
              id: 'FORSKL_3_3',
              navn: '§ 3 tredje ledd',
            },
            {
              id: 'FORSKL_4_1',
              navn: '§ 4 første ledd',
            },
            {
              id: 'FORSKL_4_2',
              navn: '§ 4 andre ledd',
            },
            {
              id: 'FORSKL_4_3',
              navn: '§ 4 tredje ledd',
            },
            {
              id: '676',
              navn: '§ 5',
            },
            {
              id: '677',
              navn: '§ 6',
            },
            {
              id: '679',
              navn: '§ 7 første ledd',
            },
            {
              id: '680',
              navn: '§ 7 andre ledd',
            },
            {
              id: 'FORSKL_7_3',
              navn: '§ 7 tredje ledd',
            },
            {
              id: 'FORSKL_7_4',
              navn: '§ 7 fjerde ledd',
            },
            {
              id: 'FORSKL_8',
              navn: '§ 8 (tilbakekreving)',
            },
            {
              id: 'FORSKL_9',
              navn: '§ 9 (klagefrist)',
            },
          ],
        },
        {
          lovkilde: {
            id: '36',
            navn: 'Bidragsinnkrevingsloven',
            beskrivelse: 'Bidragsinnkrevingsloven',
          },
          registreringshjemler: [
            {
              id: 'INNKL_25_T',
              navn: '§ 25 (tilbakekreving)',
            },
            {
              id: 'INNKL_26A_T',
              navn: '§ 26 første ledd (tilbakekreving)',
            },
            {
              id: 'INNKL_26B_T',
              navn: '§ 26 andre ledd (tilbakekreving)',
            },
            {
              id: 'INNKL_29',
              navn: '§ 29 (tilbakekreving)',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '668',
              navn: '§ 31 første ledd bokstav a',
            },
            {
              id: '669',
              navn: '§ 31 første ledd bokstav b',
            },
            {
              id: '670',
              navn: '§ 31 andre ledd',
            },
            {
              id: '671',
              navn: '§ 31 tredje ledd',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '64',
            navn: 'Forskrift om i hvilke tilfelle vilkåret i forskotteringsloven om bosted og opphold i riket skal anses oppfyllt og om i hvilke tilfelle bidragsforskott kan utbetales i utlandet',
            beskrivelse: 'Forskrift om bidragsforskott (bosted og opphold)',
          },
          registreringshjemler: [
            {
              id: 'FORSKRIFT_OM_BIDRAGSFORSKOTT_BOSTED_OG_OPPHOLD_2',
              navn: '§ 2',
            },
            {
              id: 'FORSKRIFT_OM_BIDRAGSFORSKOTT_BOSTED_OG_OPPHOLD_3',
              navn: '§ 3',
            },
          ],
        },
        {
          lovkilde: {
            id: '65',
            navn: 'Forskrift om i hvilke tilfelle det kan ytes bidragsforskott til barn som har delt bosted',
            beskrivelse: 'Forskrift om bidragsforskott ved delt bosted',
          },
          registreringshjemler: [
            {
              id: 'FORSKRIFT_OM_BIDRAGSFORSKOTT_VED_DELT_BOSTED_2',
              navn: '§ 2',
            },
          ],
        },
        {
          lovkilde: {
            id: '66',
            navn: 'Forskrift om i hvilke tilfelle bidragsfogden skal fastsette eller endre bidrag av eget tiltak etter forskotteringsloven § 3 annet ledd',
            beskrivelse: 'Forskrift om bidragsendring, forskotteringsloven',
          },
          registreringshjemler: [
            {
              id: 'FORSKRIFT_OM_BIDRAGSENDRING_FORSKOTTERINGSLOVEN_1',
              navn: '§ 1',
            },
          ],
        },
        {
          lovkilde: {
            id: '67',
            navn: 'Forskrift om gjennomføringen av bestemmelsene om inntektsprøving av forskott',
            beskrivelse: 'Forskrift om inntektsprøving av forskott',
          },
          registreringshjemler: [
            {
              id: 'FORSKRIFT_OM_INNTEKTSPRØVING_AV_FORSKOTT_2',
              navn: '§ 2',
            },
            {
              id: 'FORSKRIFT_OM_INNTEKTSPRØVING_AV_FORSKOTT_3',
              navn: '§ 3',
            },
            {
              id: 'FORSKRIFT_OM_INNTEKTSPRØVING_AV_FORSKOTT_4',
              navn: '§ 4',
            },
          ],
        },
        {
          lovkilde: {
            id: '62',
            navn: 'Spesiell lovkilde',
            beskrivelse: 'Spesiell lovkilde',
          },
          registreringshjemler: [
            {
              id: 'SPESIELL_LOVKILDE_A',
              navn: 'Ettergivelse på ulovfestet grunnlag',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4820',
          navn: 'Nav Familie- og pensjonsytelser Vadsø',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '15',
      navn: 'Bidragsområdet - Bidragsinnkreving',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '36',
            navn: 'Bidragsinnkrevingsloven',
            beskrivelse: 'Bidragsinnkrevingsloven',
          },
          registreringshjemler: [
            {
              id: 'INNKL_0_PR_BID',
              navn: '§ 0 Prosjekt bidrag',
            },
            {
              id: '681',
              navn: '§ 1',
            },
            {
              id: '822',
              navn: '§ 2',
            },
            {
              id: '682',
              navn: '§ 5',
            },
            {
              id: 'INNKL_7',
              navn: '§ 7 (tvangsgrunnlag)',
            },
            {
              id: 'INNKL_8',
              navn: '§ 8',
            },
            {
              id: '683',
              navn: '§ 25',
            },
            {
              id: '684',
              navn: '§ 26 første ledd',
            },
            {
              id: '685',
              navn: '§ 26 andre ledd',
            },
            {
              id: 'INNKL_27',
              navn: '§ 27',
            },
            {
              id: 'INNKL_29',
              navn: '§ 29 (tilbakekreving)',
            },
          ],
        },
        {
          lovkilde: {
            id: '32',
            navn: 'Barnelova',
            beskrivelse: 'Bl',
          },
          registreringshjemler: [
            {
              id: 'BL_78',
              navn: '§ 78 (tvangsgrunnlag)',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '668',
              navn: '§ 31 første ledd bokstav a',
            },
            {
              id: '669',
              navn: '§ 31 første ledd bokstav b',
            },
            {
              id: '670',
              navn: '§ 31 andre ledd',
            },
            {
              id: '671',
              navn: '§ 31 tredje ledd',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '53',
            navn: 'Haag-konvensjonen',
            beskrivelse: 'Haag-konvensjonen',
          },
          registreringshjemler: [
            {
              id: '823',
              navn: 'art. 20',
            },
            {
              id: '824',
              navn: 'art. 22',
            },
            {
              id: '825',
              navn: 'art. 28',
            },
            {
              id: '826',
              navn: 'art. 30',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4820',
          navn: 'Nav Familie- og pensjonsytelser Vadsø',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '14',
      navn: 'Bidragsområdet - Ektefellebidrag',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '37',
            navn: 'Ekteskapsloven',
            beskrivelse: 'El',
          },
          registreringshjemler: [
            {
              id: '686',
              navn: '§ 79',
            },
            {
              id: '687',
              navn: '§ 80',
            },
            {
              id: '688',
              navn: '§ 81',
            },
            {
              id: '689',
              navn: '§ 82',
            },
            {
              id: '690',
              navn: '§ 83',
            },
            {
              id: '691',
              navn: '§ 84',
            },
            {
              id: '692',
              navn: '§ 85',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '668',
              navn: '§ 31 første ledd bokstav a',
            },
            {
              id: '669',
              navn: '§ 31 første ledd bokstav b',
            },
            {
              id: '670',
              navn: '§ 31 andre ledd',
            },
            {
              id: '671',
              navn: '§ 31 tredje ledd',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '45',
      navn: 'Bidragsområdet - Far- og morskap',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '32',
            navn: 'Barnelova',
            beskrivelse: 'Bl',
          },
          registreringshjemler: [
            {
              id: '622',
              navn: '§ 7 (farskap)',
            },
            {
              id: '641',
              navn: '§ 80',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4860',
          navn: 'Nav Familie- og pensjonsytelser Farskap',
        },
        {
          id: '4863',
          navn: 'Nav Familie- og pensjonsytelser midlertidig enhet',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '13',
      navn: 'Bidragsområdet - Oppfostringsbidrag',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '38',
            navn: 'Barnevernloven',
            beskrivelse: 'Bvl',
          },
          registreringshjemler: [
            {
              id: 'BVL_15_2',
              navn: '§ 15-12',
            },
            {
              id: 'BVL_15_2A',
              navn: '§ 15-12 første ledd',
            },
            {
              id: 'BVL_15_2B',
              navn: '§ 15-12 andre ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '56',
            navn: 'Forskrift om fastsetting og endring av oppfostringsbidrag etter lov om barneverntjenester',
            beskrivelse: 'Forskrift om oppfostringsbidrag',
          },
          registreringshjemler: [
            {
              id: '844',
              navn: '§ 1',
            },
            {
              id: '845',
              navn: '§ 2',
            },
            {
              id: '846',
              navn: '§ 3',
            },
            {
              id: '847',
              navn: '§ 4',
            },
            {
              id: '848',
              navn: '§ 5',
            },
            {
              id: '849',
              navn: '§ 6',
            },
            {
              id: '850',
              navn: '§ 7',
            },
            {
              id: '851',
              navn: '§ 8',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '668',
              navn: '§ 31 første ledd bokstav a',
            },
            {
              id: '669',
              navn: '§ 31 første ledd bokstav b',
            },
            {
              id: '670',
              navn: '§ 31 andre ledd',
            },
            {
              id: '671',
              navn: '§ 31 tredje ledd',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '16',
      navn: 'Dagpenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: 'FTRL_4_0B',
              navn: '§ 4-0 forenklet o-brev',
            },
            {
              id: 'FTRL_4_0C',
              navn: '§ 4-0 uten o-brev',
            },
            {
              id: 'FTRL_4_0A',
              navn: '§ 4-0 vanlig o-brev',
            },
            {
              id: 'FTRL_4_1A',
              navn: '§ 4-1a',
            },
            {
              id: '232',
              navn: '§ 4-2',
            },
            {
              id: '233',
              navn: '§ 4-3 første ledd',
            },
            {
              id: '234',
              navn: '§ 4-3 andre ledd',
            },
            {
              id: '235',
              navn: '§ 4-4',
            },
            {
              id: '236',
              navn: '§ 4-5 første og andre ledd',
            },
            {
              id: '237',
              navn: '§ 4-5 tredje ledd',
            },
            {
              id: '238',
              navn: '§ 4-6 første ledd',
            },
            {
              id: '239',
              navn: '§ 4-6 tredje ledd',
            },
            {
              id: '240',
              navn: '§ 4-7 første ledd permitteringsårsak',
            },
            {
              id: 'FTRL_4_7_B',
              navn: '§ 4-7 andre ledd permitteringsperiode',
            },
            {
              id: '241',
              navn: '§ 4-8',
            },
            {
              id: '242',
              navn: '§ 4-9',
            },
            {
              id: '243',
              navn: '§ 4-10',
            },
            {
              id: '244',
              navn: '§ 4-11',
            },
            {
              id: '245',
              navn: '§ 4-12',
            },
            {
              id: '246',
              navn: '§ 4-13',
            },
            {
              id: '864',
              navn: '§ 4-14',
            },
            {
              id: 'FTRL_4_16A',
              navn: '§ 4-14 ferietillegg',
            },
            {
              id: '247',
              navn: '§ 4-15',
            },
            {
              id: 'FTRL_4_16C',
              navn: '§ 4-16 gjenopptak',
            },
            {
              id: 'FTRL_4_16B',
              navn: '§ 4-16 reberegning',
            },
            {
              id: '249',
              navn: '§ 4-18',
            },
            {
              id: '250',
              navn: '§ 4-19',
            },
            {
              id: '251',
              navn: '§ 4-20',
            },
            {
              id: '252',
              navn: '§ 4-22',
            },
            {
              id: '253',
              navn: '§ 4-23',
            },
            {
              id: '254',
              navn: '§ 4-24',
            },
            {
              id: '255',
              navn: '§ 4-25',
            },
            {
              id: '256',
              navn: '§ 4-26',
            },
            {
              id: '257',
              navn: '§ 4-27',
            },
            {
              id: '258',
              navn: '§ 4-28',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '267',
              navn: '§ 22-13 femte ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '12',
            navn: 'Dagpengeforskriften',
            beskrivelse: 'Dagpengeforskriften',
          },
          registreringshjemler: [
            {
              id: 'FS_DAG_1_5',
              navn: '§ 1-5 Helgefravær',
            },
            {
              id: 'FS_DAG_1_7',
              navn: '§ 1-7 Søke arbeid annet EØS-land',
            },
            {
              id: 'FS_DAG_1_8',
              navn: '§ 1-8 Unntatt opphold etter art. 65 nr. 1',
            },
            {
              id: 'FS_DAG_2_1',
              navn: '§ 2-1 Dagpenger ved konkurs m.v.',
            },
            {
              id: 'FS_DAG_3A_1',
              navn: '§ 3A-1',
            },
            {
              id: '841',
              navn: '§ 6-5',
            },
            {
              id: '259',
              navn: '§ 6-7',
            },
            {
              id: '855',
              navn: '§ 6-8',
            },
            {
              id: '865',
              navn: '§ 8-1',
            },
            {
              id: '260',
              navn: '§ 9-1',
            },
            {
              id: 'FS_DAG_10_4_1',
              navn: '§ 10-4 første ledd (generell stans)',
            },
            {
              id: 'FS_DAG_10_4_2',
              navn: '§ 10-4 andre ledd (stans 6U)',
            },
            {
              id: 'FS_DAG_13_1',
              navn: '§ 13-1 Minsteinntekt',
            },
            {
              id: 'FS_DAG_13_2',
              navn: '§ 13-2 Stønadsperiode',
            },
            {
              id: 'FS_DAG_13_3A',
              navn: '§ 13-3 Varighet eksport',
            },
            {
              id: 'FS_DAG_13_4A',
              navn: '§ 13-4 Unntak samboer/ektefelle',
            },
          ],
        },
        {
          lovkilde: {
            id: '13',
            navn: 'Forskrift Covid-19',
            beskrivelse: 'Covid-19-forskriften',
          },
          registreringshjemler: [
            {
              id: '858',
              navn: '§ 2-8 - fortsatt dagpengerett',
            },
            {
              id: '264',
              navn: '§ 2-10 - feriepenger',
            },
          ],
        },
        {
          lovkilde: {
            id: '57',
            navn: 'Forskrift om lønnsplikt under permittering',
            beskrivelse: 'Forskrift om lønnsplikt under permittering',
          },
          registreringshjemler: [
            {
              id: '857',
              navn: '§ 1',
            },
          ],
        },
        {
          lovkilde: {
            id: '14',
            navn: 'Permitteringslønnsloven',
            beskrivelse: 'Permitteringslønnsloven',
          },
          registreringshjemler: [
            {
              id: '265',
              navn: '§ 3',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '868',
              navn: 'art. 61',
            },
            {
              id: 'EOES_883_2004_62',
              navn: 'art. 62',
            },
            {
              id: '269',
              navn: 'art. 64',
            },
            {
              id: 'EOES_883_2004_65_1',
              navn: 'art. 65 nr. 1',
            },
            {
              id: 'EOES_883_2004_65_2',
              navn: 'art. 65 nr. 2',
            },
          ],
        },
        {
          lovkilde: {
            id: '72',
            navn: 'Konvensjon med Storbritannia',
            beskrivelse: 'Konvensjon med Storbritannia',
          },
          registreringshjemler: [
            {
              id: 'KNV_STBR_ART_58',
              navn: 'Artikkel 58 (overføring)',
            },
            {
              id: 'KNV_STBR_ART_59',
              navn: 'Artikkel 59 (beregning)',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
        {
          id: '4151',
          navn: 'Nav Økonomi Stønad',
        },
        {
          id: '4401',
          navn: 'Nav Arbeid og ytelser Sarpsborg',
        },
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4405',
          navn: 'Nav Arbeid og ytelser Innlandet',
        },
        {
          id: '4408',
          navn: 'Nav Arbeid og ytelser Skien',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4418',
          navn: 'Nav Arbeid og ytelser Fauske',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '4525',
          navn: 'Nav Kontroll Forvaltning',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_4_2',
          navn: 'Ftrl - § 4-2',
          beskrivelse: 'Folketrygdloven - § 4-2',
        },
        {
          id: 'FTRL_4_3_1',
          navn: 'Ftrl - § 4-3(1)',
          beskrivelse: 'Folketrygdloven - § 4-3(1)',
        },
        {
          id: 'FTRL_4_3_1_PERMLL',
          navn: 'Ftrl - § 4-3(1) permitteringslønnsloven',
          beskrivelse: 'Folketrygdloven - § 4-3(1) permitteringslønnsloven',
        },
        {
          id: 'FTRL_4_3_2',
          navn: 'Ftrl - § 4-3(2)',
          beskrivelse: 'Folketrygdloven - § 4-3(2)',
        },
        {
          id: 'FTRL_4_4',
          navn: 'Ftrl - § 4-4',
          beskrivelse: 'Folketrygdloven - § 4-4',
        },
        {
          id: 'FTRL_4_5_REGISTRERING',
          navn: 'Ftrl - § 4-5 registrering',
          beskrivelse: 'Folketrygdloven - § 4-5 registrering',
        },
        {
          id: 'FTRL_4_5_REELL_ARBEIDSSOEKER',
          navn: 'Ftrl - § 4-5 reell arbeidssøker',
          beskrivelse: 'Folketrygdloven - § 4-5 reell arbeidssøker',
        },
        {
          id: 'FTRL_4_6_UTDANNING',
          navn: 'Ftrl - § 4-6 utdanning',
          beskrivelse: 'Folketrygdloven - § 4-6 utdanning',
        },
        {
          id: 'FTRL_4_6_ETABLERING',
          navn: 'Ftrl - § 4-6 etablering',
          beskrivelse: 'Folketrygdloven - § 4-6 etablering',
        },
        {
          id: 'FTRL_4_7_PERMITTERINGSAARSAK',
          navn: 'Ftrl - § 4-7 permitteringsårsak',
          beskrivelse: 'Folketrygdloven - § 4-7 permitteringsårsak',
        },
        {
          id: 'FTRL_4_7_PERMITTERINGENS_LENGDE',
          navn: 'Ftrl - § 4-7 permitteringens lengde',
          beskrivelse: 'Folketrygdloven - § 4-7 permitteringens lengde',
        },
        {
          id: 'FTRL_4_8',
          navn: 'Ftrl - § 4-8',
          beskrivelse: 'Folketrygdloven - § 4-8',
        },
        {
          id: 'FTRL_4_9',
          navn: 'Ftrl - § 4-9',
          beskrivelse: 'Folketrygdloven - § 4-9',
        },
        {
          id: 'FTRL_4_10',
          navn: 'Ftrl - § 4-10',
          beskrivelse: 'Folketrygdloven - § 4-10',
        },
        {
          id: 'FTRL_4_11',
          navn: 'Ftrl - § 4-11',
          beskrivelse: 'Folketrygdloven - § 4-11',
        },
        {
          id: 'FTRL_4_12',
          navn: 'Ftrl - § 4-12',
          beskrivelse: 'Folketrygdloven - § 4-12',
        },
        {
          id: 'FTRL_4_13',
          navn: 'Ftrl - § 4-13',
          beskrivelse: 'Folketrygdloven - § 4-13',
        },
        {
          id: 'FTRL_4_14',
          navn: 'Ftrl - § 4-14',
          beskrivelse: 'Folketrygdloven - § 4-14',
        },
        {
          id: 'FTRL_4_15',
          navn: 'Ftrl - § 4-15',
          beskrivelse: 'Folketrygdloven - § 4-15',
        },
        {
          id: 'FTRL_4_16',
          navn: 'Ftrl - § 4-16',
          beskrivelse: 'Folketrygdloven - § 4-16',
        },
        {
          id: 'FTRL_4_18',
          navn: 'Ftrl - § 4-18',
          beskrivelse: 'Folketrygdloven - § 4-18',
        },
        {
          id: 'FTRL_4_19',
          navn: 'Ftrl - § 4-19',
          beskrivelse: 'Folketrygdloven - § 4-19',
        },
        {
          id: 'FTRL_4_20',
          navn: 'Ftrl - § 4-20',
          beskrivelse: 'Folketrygdloven - § 4-20',
        },
        {
          id: 'FTRL_4_22',
          navn: 'Ftrl - § 4-22',
          beskrivelse: 'Folketrygdloven - § 4-22',
        },
        {
          id: 'FTRL_4_23',
          navn: 'Ftrl - § 4-23',
          beskrivelse: 'Folketrygdloven - § 4-23',
        },
        {
          id: 'FTRL_4_24',
          navn: 'Ftrl - § 4-24',
          beskrivelse: 'Folketrygdloven - § 4-24',
        },
        {
          id: 'FTRL_4_25',
          navn: 'Ftrl - § 4-25',
          beskrivelse: 'Folketrygdloven - § 4-25',
        },
        {
          id: 'FTRL_4_26',
          navn: 'Ftrl - § 4-26',
          beskrivelse: 'Folketrygdloven - § 4-26',
        },
        {
          id: 'FTRL_4_27',
          navn: 'Ftrl - § 4-27',
          beskrivelse: 'Folketrygdloven - § 4-27',
        },
        {
          id: 'FTRL_4_28',
          navn: 'Ftrl - § 4-28',
          beskrivelse: 'Folketrygdloven - § 4-28',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'FS_DAG_2_1_FORSKUTTERTE_DAGPENGER',
          navn: 'Dagpengeforskriften - § 2-1 forskutterte dagpenger',
          beskrivelse: 'Dagpengeforskriften - § 2-1 forskutterte dagpenger',
        },
        {
          id: 'FS_DAG_3A_1',
          navn: 'Dagpengeforskriften - § 3A-1',
          beskrivelse: 'Dagpengeforskriften - § 3A-1',
        },
        {
          id: 'FS_DAG_6_7_FISKEPERMITTERING',
          navn: 'Dagpengeforskriften - § 6-7 fiskepermittering',
          beskrivelse: 'Dagpengeforskriften - § 6-7 fiskepermittering',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_41',
          navn: 'Fvl - § 41',
          beskrivelse: 'Forvaltningsloven - § 41',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'EOES_883_2004_61',
          navn: 'EØS forordning 883/2004 - art. 61',
          beskrivelse: 'EØS forordning 883/2004 - art. 61',
        },
        {
          id: 'EOES_883_2004_64',
          navn: 'EØS forordning 883/2004 - art. 64',
          beskrivelse: 'EØS forordning 883/2004 - art. 64',
        },
        {
          id: 'EOES_883_2004_65_1',
          navn: 'EØS forordning 883/2004 - art. 65 nr. 1',
          beskrivelse: 'EØS forordning 883/2004 - art. 65 nr. 1',
        },
        {
          id: 'EOES_883_2004_65_2',
          navn: 'EØS forordning 883/2004 - art. 65 nr. 2',
          beskrivelse: 'EØS forordning 883/2004 - art. 65 nr. 2',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
        {
          id: 'TRRL_14',
          navn: 'Trrl - § 14',
          beskrivelse: 'Trygderettsloven - § 14',
        },
        {
          id: 'TRRL_27',
          navn: 'Trrl - § 27',
          beskrivelse: 'Trygderettsloven - § 27',
        },
      ],
    },
    {
      id: '17',
      navn: 'Enslig mor eller far',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: 'FTRL_15_1A',
              navn: '§ 15-1a',
            },
            {
              id: '431',
              navn: '§ 15-2',
            },
            {
              id: '432',
              navn: '§ 15-3',
            },
            {
              id: '433',
              navn: '§ 15-4',
            },
            {
              id: 'FTRL_15_4_1_1',
              navn: '§ 15-4 første ledd første punktum - sivilstatus',
            },
            {
              id: 'FTRL_15_4_3_2',
              navn: '§ 15-4 tredje ledd andre punktum - samboer/lever sammen',
            },
            {
              id: 'FTRL_15_4_3_4',
              navn: '§ 15-4 tredje ledd fjerde punktum - nytt barn sammen med far',
            },
            {
              id: 'FTRL_15_4_4_1',
              navn: '§ 15-4 fjerde ledd første punktum - omsorg',
            },
            {
              id: 'FTRL_15_4_4_2',
              navn: '§ 15-4 fjerde ledd andre punktum - nære boforhold',
            },
            {
              id: '434',
              navn: '§ 15-5',
            },
            {
              id: '435',
              navn: '§ 15-6',
            },
            {
              id: 'FTRL_15_6_1_C',
              navn: '§ 15-6 første ledd bokstav c - nødvendig og hensiktsmessig utdanning',
            },
            {
              id: '436',
              navn: '§ 15-7',
            },
            {
              id: '437',
              navn: '§ 15-8',
            },
            {
              id: 'FTRL_15_8_2A',
              navn: '§ 15-8 andre ledd - nødvendig og hensiktsmessig utdanning',
            },
            {
              id: 'FTRL_15_8_3A',
              navn: '§ 15-8 tredje ledd - særlig tilsynskrevende barn',
            },
            {
              id: 'FTRL_15_8_3B',
              navn: '§ 15-8 fjerde ledd - forbigående sykdom',
            },
            {
              id: 'FTRL_15_8_5A',
              navn: '§ 15-8 femte ledd - påvente',
            },
            {
              id: '439',
              navn: '§ 15-9',
            },
            {
              id: '440',
              navn: '§ 15-10',
            },
            {
              id: '441',
              navn: '§ 15-11',
            },
            {
              id: '442',
              navn: '§ 15-12',
            },
            {
              id: '443',
              navn: '§ 15-13',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
            {
              id: 'TRRL_29',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '30',
            navn: 'EØS-avtalen',
            beskrivelse: 'EØS-avtalen',
          },
          registreringshjemler: [
            {
              id: '601',
              navn: 'EØS-avtalen',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '602',
              navn: 'art. 14',
            },
            {
              id: '603',
              navn: 'art. 15',
            },
            {
              id: '604',
              navn: 'art. 16',
            },
            {
              id: '605',
              navn: 'art. 67',
            },
            {
              id: '620',
              navn: 'art. 68',
            },
            {
              id: '384',
              navn: 'art. 69',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '607',
              navn: 'art. 14',
            },
            {
              id: '662',
              navn: 'art. 58',
            },
            {
              id: '663',
              navn: 'art. 59',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4415',
          navn: 'Nav Arbeid og ytelser Molde',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4408',
          navn: 'Nav Arbeid og ytelser Skien',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '431',
          navn: 'Ftrl - § 15-2',
          beskrivelse: 'Folketrygdloven - § 15-2',
        },
        {
          id: '432',
          navn: 'Ftrl - § 15-3',
          beskrivelse: 'Folketrygdloven - § 15-3',
        },
        {
          id: '433',
          navn: 'Ftrl - § 15-4',
          beskrivelse: 'Folketrygdloven - § 15-4',
        },
        {
          id: '434',
          navn: 'Ftrl - § 15-5',
          beskrivelse: 'Folketrygdloven - § 15-5',
        },
        {
          id: '435',
          navn: 'Ftrl - § 15-6',
          beskrivelse: 'Folketrygdloven - § 15-6',
        },
        {
          id: '437',
          navn: 'Ftrl - § 15-8',
          beskrivelse: 'Folketrygdloven - § 15-8',
        },
        {
          id: '439',
          navn: 'Ftrl - § 15-9',
          beskrivelse: 'Folketrygdloven - § 15-9',
        },
        {
          id: '440',
          navn: 'Ftrl - § 15-10',
          beskrivelse: 'Folketrygdloven - § 15-10',
        },
        {
          id: '441',
          navn: 'Ftrl - § 15-11',
          beskrivelse: 'Folketrygdloven - § 15-11',
        },
        {
          id: '442',
          navn: 'Ftrl - § 15-12',
          beskrivelse: 'Folketrygdloven - § 15-12',
        },
        {
          id: '443',
          navn: 'Ftrl - § 15-13',
          beskrivelse: 'Folketrygdloven - § 15-13',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '7',
      navn: 'Foreldrepenger - Engangsstønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '421',
              navn: '§ 2-9',
            },
            {
              id: '422',
              navn: '§ 2-10',
            },
            {
              id: '423',
              navn: '§ 2-11',
            },
            {
              id: '424',
              navn: '§ 2-12',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: 'FTRL_14_0B',
              navn: '§ 14-0 forenklet o-brev',
            },
            {
              id: 'FTRL_14_0C',
              navn: '§ 14-0 uten o-brev',
            },
            {
              id: 'FTRL_14_0A',
              navn: '§ 14-0 vanlig o-brev',
            },
            {
              id: '399',
              navn: '§ 14-2',
            },
            {
              id: '429',
              navn: '§ 14-17',
            },
            {
              id: 'FTRL_14_17_GAMMEL',
              navn: '§ 14-17 - før 1. oktober 2024',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '223',
              navn: '§ 22-13 andre ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: 'EOES_883_2004_5',
              navn: 'art. 5',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4842',
          navn: 'Nav Familie- og pensjonsytelser Stord',
        },
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '399',
          navn: 'Ftrl - § 14-2',
          beskrivelse: 'Folketrygdloven - § 14-2',
        },
        {
          id: '429',
          navn: 'Ftrl - § 14-17',
          beskrivelse: 'Folketrygdloven - § 14-17',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '6',
      navn: 'Foreldrepenger - Foreldrepenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '414',
              navn: '§ 8-28',
            },
            {
              id: '189',
              navn: '§ 8-29',
            },
            {
              id: 'FTRL_14_0B',
              navn: '§ 14-0 forenklet o-brev',
            },
            {
              id: 'FTRL_14_0C',
              navn: '§ 14-0 uten o-brev',
            },
            {
              id: 'FTRL_14_0A',
              navn: '§ 14-0 vanlig o-brev',
            },
            {
              id: '399',
              navn: '§ 14-2',
            },
            {
              id: '401',
              navn: '§ 14-5',
            },
            {
              id: 'FTRL_14_5_GRUPPE_2_LAND',
              navn: '§ 14-5 gruppe 2 land',
            },
            {
              id: '402',
              navn: '§ 14-6',
            },
            {
              id: 'FTRL_14_7F',
              navn: '§ 14-7 Arb. taker, selvst. næringsdrivende og frilanser',
            },
            {
              id: 'FTRL_14_7I',
              navn: '§ 14-7 Arbeidsavklaringspenger',
            },
            {
              id: 'FTRL_14_7A',
              navn: '§ 14-7 Arbeidstaker',
            },
            {
              id: 'FTRL_14_7C',
              navn: '§ 14-7 Arbeidstaker og frilanser',
            },
            {
              id: 'FTRL_14_7D',
              navn: '§ 14-7 Arbeidstaker og selvst. næringsdrivende',
            },
            {
              id: 'FTRL_14_7H',
              navn: '§ 14-7 Dagpenger',
            },
            {
              id: 'FTRL_14_7G',
              navn: '§ 14-7 Midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_14_7B',
              navn: '§ 14-7 Selvs. næringsdrivende',
            },
            {
              id: 'FTRL_14_7E',
              navn: '§ 14-7 Selvst. næringsdrivende og frilanser',
            },
            {
              id: '405',
              navn: '§ 14-9',
            },
            {
              id: '406',
              navn: '§ 14-10',
            },
            {
              id: '869',
              navn: '§ 14-10a',
            },
            {
              id: '407',
              navn: '§ 14-11',
            },
            {
              id: '408',
              navn: '§ 14-12',
            },
            {
              id: '409',
              navn: '§ 14-13',
            },
            {
              id: '410',
              navn: '§ 14-14',
            },
            {
              id: '411',
              navn: '§ 14-15',
            },
            {
              id: '412',
              navn: '§ 14-16',
            },
            {
              id: '429',
              navn: '§ 14-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '223',
              navn: '§ 22-13 andre ledd',
            },
            {
              id: '224',
              navn: '§ 22-13 tredje ledd',
            },
            {
              id: '225',
              navn: '§ 22-13 sjette ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '227',
              navn: '§ 22-13 åttende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: 'EOES_883_2004_5',
              navn: 'art. 5',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '68',
            navn: 'Annet',
            beskrivelse: 'Annet',
          },
          registreringshjemler: [
            {
              id: 'FEDREKVOTESAK',
              navn: 'Fedrekvotesak',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4842',
          navn: 'Nav Familie- og pensjonsytelser Stord',
        },
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '399',
          navn: 'Ftrl - § 14-2',
          beskrivelse: 'Folketrygdloven - § 14-2',
        },
        {
          id: '401',
          navn: 'Ftrl - § 14-5',
          beskrivelse: 'Folketrygdloven - § 14-5',
        },
        {
          id: '402',
          navn: 'Ftrl - § 14-6',
          beskrivelse: 'Folketrygdloven - § 14-6',
        },
        {
          id: '403',
          navn: 'Ftrl - § 14-7',
          beskrivelse: 'Folketrygdloven - § 14-7',
        },
        {
          id: '405',
          navn: 'Ftrl - § 14-9',
          beskrivelse: 'Folketrygdloven - § 14-9',
        },
        {
          id: '406',
          navn: 'Ftrl - § 14-10',
          beskrivelse: 'Folketrygdloven - § 14-10',
        },
        {
          id: '407',
          navn: 'Ftrl - § 14-11',
          beskrivelse: 'Folketrygdloven - § 14-11',
        },
        {
          id: '408',
          navn: 'Ftrl - § 14-12',
          beskrivelse: 'Folketrygdloven - § 14-12',
        },
        {
          id: '409',
          navn: 'Ftrl - § 14-13',
          beskrivelse: 'Folketrygdloven - § 14-13',
        },
        {
          id: '410',
          navn: 'Ftrl - § 14-14',
          beskrivelse: 'Folketrygdloven - § 14-14',
        },
        {
          id: '411',
          navn: 'Ftrl - § 14-15',
          beskrivelse: 'Folketrygdloven - § 14-15',
        },
        {
          id: '412',
          navn: 'Ftrl - § 14-16',
          beskrivelse: 'Folketrygdloven - § 14-16',
        },
        {
          id: '429',
          navn: 'Ftrl - § 14-17',
          beskrivelse: 'Folketrygdloven - § 14-17',
        },
        {
          id: '1000.008.002',
          navn: 'Ftrl - § 8-2',
          beskrivelse: 'Folketrygdloven - § 8-2',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'EOES_883_2004_5',
          navn: 'EØS forordning 883/2004 - art. 5',
          beskrivelse: 'EØS forordning 883/2004 - art. 5',
        },
        {
          id: '228',
          navn: 'EØS forordning 883/2004 - art. 6',
          beskrivelse: 'EØS forordning 883/2004 - art. 6',
        },
        {
          id: 'FEDREKVOTESAK',
          navn: 'Annet - Fedrekvotesak',
          beskrivelse: 'Annet - Fedrekvotesak',
        },
      ],
    },
    {
      id: '8',
      navn: 'Foreldrepenger - Svangerskapspenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '156',
              navn: '§ 8-2',
            },
            {
              id: '1000.008.013',
              navn: '§ 8-13',
            },
            {
              id: '414',
              navn: '§ 8-28',
            },
            {
              id: '189',
              navn: '§ 8-29',
            },
            {
              id: 'FTRL_14_0B',
              navn: '§ 14-0 forenklet o-brev',
            },
            {
              id: 'FTRL_14_0C',
              navn: '§ 14-0 uten o-brev',
            },
            {
              id: 'FTRL_14_0A',
              navn: '§ 14-0 vanlig o-brev',
            },
            {
              id: '399',
              navn: '§ 14-2',
            },
            {
              id: '430',
              navn: '§ 14-4',
            },
            {
              id: '401',
              navn: '§ 14-5',
            },
            {
              id: 'FTRL_14_7F',
              navn: '§ 14-7 Arb. taker, selvst. næringsdrivende og frilanser',
            },
            {
              id: 'FTRL_14_7I',
              navn: '§ 14-7 Arbeidsavklaringspenger',
            },
            {
              id: 'FTRL_14_7A',
              navn: '§ 14-7 Arbeidstaker',
            },
            {
              id: 'FTRL_14_7C',
              navn: '§ 14-7 Arbeidstaker og frilanser',
            },
            {
              id: 'FTRL_14_7D',
              navn: '§ 14-7 Arbeidstaker og selvst. næringsdrivende',
            },
            {
              id: 'FTRL_14_7H',
              navn: '§ 14-7 Dagpenger',
            },
            {
              id: 'FTRL_14_7G',
              navn: '§ 14-7 Midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_14_7B',
              navn: '§ 14-7 Selvs. næringsdrivende',
            },
            {
              id: 'FTRL_14_7E',
              navn: '§ 14-7 Selvst. næringsdrivende og frilanser',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '223',
              navn: '§ 22-13 andre ledd',
            },
            {
              id: '224',
              navn: '§ 22-13 tredje ledd',
            },
            {
              id: '225',
              navn: '§ 22-13 sjette ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '227',
              navn: '§ 22-13 åttende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: 'EOES_883_2004_5',
              navn: 'art. 5',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4842',
          navn: 'Nav Familie- og pensjonsytelser Stord',
        },
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '399',
          navn: 'Ftrl - § 14-2',
          beskrivelse: 'Folketrygdloven - § 14-2',
        },
        {
          id: '430',
          navn: 'Ftrl - § 14-4',
          beskrivelse: 'Folketrygdloven - § 14-4',
        },
        {
          id: '402',
          navn: 'Ftrl - § 14-6',
          beskrivelse: 'Folketrygdloven - § 14-6',
        },
        {
          id: '403',
          navn: 'Ftrl - § 14-7',
          beskrivelse: 'Folketrygdloven - § 14-7',
        },
        {
          id: '1000.008.002',
          navn: 'Ftrl - § 8-2',
          beskrivelse: 'Folketrygdloven - § 8-2',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: '228',
          navn: 'EØS forordning 883/2004 - art. 6',
          beskrivelse: 'EØS forordning 883/2004 - art. 6',
        },
      ],
    },
    {
      id: '51',
      navn: 'Forsikring',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '195',
              navn: '§ 8-35',
            },
            {
              id: '196',
              navn: '§ 8-36',
            },
            {
              id: '197',
              navn: '§ 8-37',
            },
            {
              id: '198',
              navn: '§ 8-38',
            },
            {
              id: '199',
              navn: '§ 8-39',
            },
            {
              id: '200',
              navn: '§ 8-40',
            },
            {
              id: '415',
              navn: '§ 8-41',
            },
            {
              id: '203',
              navn: '§ 8-42',
            },
            {
              id: '204',
              navn: '§ 8-43',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4411',
          navn: 'Nav Arbeid og ytelser Karmøy',
        },
        {
          id: '4488',
          navn: 'Nav AY Sykepenger',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.008.036',
          navn: 'Ftrl - § 8-36',
          beskrivelse: 'Folketrygdloven - § 8-36',
        },
        {
          id: '1000.008.037',
          navn: 'Ftrl - § 8-37',
          beskrivelse: 'Folketrygdloven - § 8-37',
        },
        {
          id: '1000.008.039',
          navn: 'Ftrl - § 8-39',
          beskrivelse: 'Folketrygdloven - § 8-39',
        },
      ],
    },
    {
      id: '48',
      navn: 'Forskudd dagpenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '50',
            navn: 'Midlertidig forskrift om forskudd på dagpenger for å avhjelpe konsekvensene av covid-19',
            beskrivelse: 'Midlertidig forskrift om forskudd på dagpenger for å avhjelpe konsekvensene av covid-19',
          },
          registreringshjemler: [
            {
              id: '785',
              navn: '§ 6 første og andre ledd',
            },
            {
              id: '786',
              navn: '§ 6 tredje ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4153',
          navn: 'Nav Økonomi Stønad',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '30',
      navn: 'Gjenlevende - Gjenlevende',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '485',
              navn: '§ 1-5',
            },
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '418',
              navn: '§ 2-5',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '486',
              navn: '§ 3-2',
            },
            {
              id: '487',
              navn: '§ 3-3',
            },
            {
              id: '488',
              navn: '§ 3-5',
            },
            {
              id: '489',
              navn: '§ 3-7',
            },
            {
              id: '490',
              navn: '§ 3-8',
            },
            {
              id: '491',
              navn: '§ 3-9',
            },
            {
              id: '492',
              navn: '§ 3-10',
            },
            {
              id: '493',
              navn: '§ 3-11',
            },
            {
              id: '494',
              navn: '§ 3-12',
            },
            {
              id: '495',
              navn: '§ 3-13',
            },
            {
              id: '496',
              navn: '§ 3-14',
            },
            {
              id: '497',
              navn: '§ 3-15',
            },
            {
              id: '498',
              navn: '§ 3-16',
            },
            {
              id: '499',
              navn: '§ 3-17',
            },
            {
              id: '500',
              navn: '§ 3-18',
            },
            {
              id: '501',
              navn: '§ 3-19',
            },
            {
              id: '502',
              navn: '§ 3-22',
            },
            {
              id: '503',
              navn: '§ 3-23',
            },
            {
              id: '552',
              navn: '§ 17-2',
            },
            {
              id: 'FTRL_17_2_FOER_2024',
              navn: '§ 17-2 - Før 01.01.2024',
            },
            {
              id: '553',
              navn: '§ 17-3',
            },
            {
              id: 'FTRL_17_3_GAMMEL',
              navn: '§ 17-3 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_4_1',
              navn: '§ 17-4 første ledd',
            },
            {
              id: 'FTRL_17_4_2',
              navn: '§ 17-4 andre ledd',
            },
            {
              id: '554',
              navn: '§ 17-4 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_5_1',
              navn: '§ 17-5 første ledd',
            },
            {
              id: 'FTRL_17_5_2',
              navn: '§ 17-5 andre ledd',
            },
            {
              id: 'FTRL_17_5_3',
              navn: '§ 17-5 tredje ledd',
            },
            {
              id: '555',
              navn: '§ 17-5 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_6_NY',
              navn: '§ 17-6',
            },
            {
              id: '556',
              navn: '§ 17-6 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_7_NY',
              navn: '§ 17-7',
            },
            {
              id: '557',
              navn: '§ 17-7 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_8_NY',
              navn: '§ 17-8',
            },
            {
              id: '558',
              navn: '§ 17-8 inntekt - Før 01.01.2024',
            },
            {
              id: '559',
              navn: '§ 17-9 - Før 01.01.2024',
            },
            {
              id: 'FTRL_17_9_NY',
              navn: '§ 17-9 inntekt',
            },
            {
              id: '560',
              navn: '§ 17-10 tilleggsstønader',
            },
            {
              id: '561',
              navn: '§ 17-11',
            },
            {
              id: '562',
              navn: '§ 17-12',
            },
            {
              id: '564',
              navn: '§ 17-14',
            },
            {
              id: 'FTRL_17_15',
              navn: '§ 17-15 familiepleier',
            },
            {
              id: '565',
              navn: '§ 17 A-1',
            },
            {
              id: '566',
              navn: '§ 17 A-2',
            },
            {
              id: '567',
              navn: '§ 17 A-3 stønadsperiode',
            },
            {
              id: '568',
              navn: '§ 17 A-4',
            },
            {
              id: '569',
              navn: '§ 17 A-5 bortfall',
            },
            {
              id: '570',
              navn: '§ 17 A-6 inntekt',
            },
            {
              id: '571',
              navn: '§ 17 A-7',
            },
            {
              id: '572',
              navn: '§ 17 A-8',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '529',
              navn: '§ 21-4',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '69',
            navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17',
            beskrivelse:
              'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17',
          },
          registreringshjemler: [
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_2',
              navn: '§ 2',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_3',
              navn: '§ 3',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_4',
              navn: '§ 4',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_5',
              navn: '§ 5',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_6',
              navn: '§ 6',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_7',
              navn: '§ 7',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_8',
              navn: '§ 8',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_9',
              navn: '§ 9',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_10',
              navn: '§ 10',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '530',
              navn: 'art. 1',
            },
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '379',
              navn: 'art. 50',
            },
            {
              id: '380',
              navn: 'art. 51',
            },
            {
              id: '381',
              navn: 'art. 52',
            },
            {
              id: '531',
              navn: 'art. 53',
            },
            {
              id: '532',
              navn: 'art. 54',
            },
            {
              id: '533',
              navn: 'art. 55',
            },
            {
              id: '534',
              navn: 'art. 56',
            },
            {
              id: '382',
              navn: 'art. 57',
            },
            {
              id: '383',
              navn: 'art. 58',
            },
            {
              id: '535',
              navn: 'art. 59',
            },
            {
              id: '536',
              navn: 'art. 60',
            },
            {
              id: '385',
              navn: 'art. 70',
            },
            {
              id: '386',
              navn: 'art. 87',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '537',
              navn: 'art. 10',
            },
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '314',
              navn: 'art. 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '20',
            navn: 'Forordning 1408/71',
            beskrivelse: 'Forordning 1408/71',
          },
          registreringshjemler: [
            {
              id: '395',
              navn: 'Forordning 1408/71',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '23',
            navn: 'Trygdeavtaler med England',
            beskrivelse: 'Trygdeavtaler med England',
          },
          registreringshjemler: [
            {
              id: '539',
              navn: 'Trygdeavtaler med England',
            },
          ],
        },
        {
          lovkilde: {
            id: '24',
            navn: 'Trygdeavtaler med USA',
            beskrivelse: 'Trygdeavtaler med USA',
          },
          registreringshjemler: [
            {
              id: '540',
              navn: 'Trygdeavtaler med USA',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4808',
          navn: 'Nav Familie- og pensjonsytelser Porsgrunn',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '4862',
          navn: 'Nav Familie- og pensjonsytelser utland Ålesund',
        },
        {
          id: '0001',
          navn: 'Nav Pensjon Utland',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_17_2',
          navn: 'Ftrl - § 17-2',
          beskrivelse: 'Folketrygdloven - § 17-2',
        },
        {
          id: 'FTRL_17_2_FOER_2024',
          navn: 'Ftrl - § 17-2 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-2 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_3',
          navn: 'Ftrl - § 17-3',
          beskrivelse: 'Folketrygdloven - § 17-3',
        },
        {
          id: 'FTRL_17_4_1',
          navn: 'Ftrl - § 17-4 første ledd',
          beskrivelse: 'Folketrygdloven - § 17-4 første ledd',
        },
        {
          id: 'FTRL_17_4_2',
          navn: 'Ftrl - § 17-4 andre ledd',
          beskrivelse: 'Folketrygdloven - § 17-4 andre ledd',
        },
        {
          id: 'FTRL_17_4',
          navn: 'Ftrl - § 17-4 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-4 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_5_1',
          navn: 'Ftrl - § 17-5 første ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 første ledd',
        },
        {
          id: 'FTRL_17_5_2',
          navn: 'Ftrl - § 17-5 andre ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 andre ledd',
        },
        {
          id: 'FTRL_17_5_3',
          navn: 'Ftrl - § 17-5 tredje ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 tredje ledd',
        },
        {
          id: 'FTRL_17_5',
          navn: 'Ftrl - § 17-5 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-5 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_6_NY',
          navn: 'Ftrl - § 17-6',
          beskrivelse: 'Folketrygdloven - § 17-6',
        },
        {
          id: 'FTRL_17_6',
          navn: 'Ftrl - § 17-6 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-6 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_7_NY',
          navn: 'Ftrl - § 17-7',
          beskrivelse: 'Folketrygdloven - § 17-7',
        },
        {
          id: 'FTRL_17_7',
          navn: 'Ftrl - § 17-7 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-7 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_8_NY',
          navn: 'Ftrl - § 17-8',
          beskrivelse: 'Folketrygdloven - § 17-8',
        },
        {
          id: 'FTRL_17_8',
          navn: 'Ftrl - § 17-8 inntekt - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-8 inntekt - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_9_NY',
          navn: 'Ftrl - § 17-9 inntekt',
          beskrivelse: 'Folketrygdloven - § 17-9 inntekt',
        },
        {
          id: 'FTRL_17_9',
          navn: 'Ftrl - § 17-9 - Før 01.01.2024',
          beskrivelse: 'Folketrygdloven - § 17-9 - Før 01.01.2024',
        },
        {
          id: 'FTRL_17_10',
          navn: 'Ftrl - § 17-10 tilleggsstønader',
          beskrivelse: 'Folketrygdloven - § 17-10 tilleggsstønader',
        },
        {
          id: 'FTRL_17_11',
          navn: 'Ftrl - § 17-11',
          beskrivelse: 'Folketrygdloven - § 17-11',
        },
        {
          id: 'FTRL_17_12',
          navn: 'Ftrl - § 17-12',
          beskrivelse: 'Folketrygdloven - § 17-12',
        },
        {
          id: 'FTRL_17_14',
          navn: 'Ftrl - § 17-14',
          beskrivelse: 'Folketrygdloven - § 17-14',
        },
        {
          id: 'FTRL_17_15',
          navn: 'Ftrl - § 17-15 familiepleier',
          beskrivelse: 'Folketrygdloven - § 17-15 familiepleier',
        },
        {
          id: 'FTRL_1_5',
          navn: 'Ftrl - § 1-5',
          beskrivelse: 'Folketrygdloven - § 1-5',
        },
        {
          id: 'FTRL_2_1',
          navn: 'Ftrl - § 2-1',
          beskrivelse: 'Folketrygdloven - § 2-1',
        },
        {
          id: 'FTRL_2_2',
          navn: 'Ftrl - § 2-2',
          beskrivelse: 'Folketrygdloven - § 2-2',
        },
        {
          id: 'FTRL_2_5',
          navn: 'Ftrl - § 2-5',
          beskrivelse: 'Folketrygdloven - § 2-5',
        },
        {
          id: 'FTRL_2_13',
          navn: 'Ftrl - § 2-13',
          beskrivelse: 'Folketrygdloven - § 2-13',
        },
        {
          id: 'FTRL_2_14',
          navn: 'Ftrl - § 2-14',
          beskrivelse: 'Folketrygdloven - § 2-14',
        },
        {
          id: 'FTRL_3_3',
          navn: 'Ftrl - § 3-3',
          beskrivelse: 'Folketrygdloven - § 3-3',
        },
        {
          id: 'FTRL_3_5_TRYGDETID',
          navn: 'Ftrl - § 3-5 (trygdetid)',
          beskrivelse: 'Folketrygdloven - § 3-5 (trygdetid)',
        },
        {
          id: 'FTRL_3_7',
          navn: 'Ftrl - § 3-7',
          beskrivelse: 'Folketrygdloven - § 3-7',
        },
        {
          id: 'FTRL_3_8',
          navn: 'Ftrl - § 3-8',
          beskrivelse: 'Folketrygdloven - § 3-8',
        },
        {
          id: 'FTRL_3_9',
          navn: 'Ftrl - § 3-9',
          beskrivelse: 'Folketrygdloven - § 3-9',
        },
        {
          id: 'FTRL_3_10',
          navn: 'Ftrl - § 3-10',
          beskrivelse: 'Folketrygdloven - § 3-10',
        },
        {
          id: 'FTRL_3_11',
          navn: 'Ftrl - § 3-11',
          beskrivelse: 'Folketrygdloven - § 3-11',
        },
        {
          id: 'FTRL_3_12',
          navn: 'Ftrl - § 3-12',
          beskrivelse: 'Folketrygdloven - § 3-12',
        },
        {
          id: 'FTRL_3_13',
          navn: 'Ftrl - § 3-13',
          beskrivelse: 'Folketrygdloven - § 3-13',
        },
        {
          id: 'FTRL_3_14',
          navn: 'Ftrl - § 3-14',
          beskrivelse: 'Folketrygdloven - § 3-14',
        },
        {
          id: 'FTRL_3_15',
          navn: 'Ftrl - § 3-15',
          beskrivelse: 'Folketrygdloven - § 3-15',
        },
        {
          id: 'FTRL_3_16',
          navn: 'Ftrl - § 3-16',
          beskrivelse: 'Folketrygdloven - § 3-16',
        },
        {
          id: 'FTRL_3_17',
          navn: 'Ftrl - § 3-17',
          beskrivelse: 'Folketrygdloven - § 3-17',
        },
        {
          id: 'FTRL_3_18',
          navn: 'Ftrl - § 3-18',
          beskrivelse: 'Folketrygdloven - § 3-18',
        },
        {
          id: 'FTRL_3_19',
          navn: 'Ftrl - § 3-19',
          beskrivelse: 'Folketrygdloven - § 3-19',
        },
        {
          id: 'FTRL_3_22',
          navn: 'Ftrl - § 3-22',
          beskrivelse: 'Folketrygdloven - § 3-22',
        },
        {
          id: 'FTRL_3_23',
          navn: 'Ftrl - § 3-23',
          beskrivelse: 'Folketrygdloven - § 3-23',
        },
        {
          id: 'FTRL_17_A_1',
          navn: 'Ftrl - § 17 A-1',
          beskrivelse: 'Folketrygdloven - § 17 A-1',
        },
        {
          id: 'FTRL_17_A_2',
          navn: 'Ftrl - § 17 A-2',
          beskrivelse: 'Folketrygdloven - § 17 A-2',
        },
        {
          id: 'FTRL_17_A_3',
          navn: 'Ftrl - § 17 A-3 stønadsperiode',
          beskrivelse: 'Folketrygdloven - § 17 A-3 stønadsperiode',
        },
        {
          id: 'FTRL_17_A_4',
          navn: 'Ftrl - § 17 A-4',
          beskrivelse: 'Folketrygdloven - § 17 A-4',
        },
        {
          id: 'FTRL_17_A_5',
          navn: 'Ftrl - § 17 A-5 bortfall',
          beskrivelse: 'Folketrygdloven - § 17 A-5 bortfall',
        },
        {
          id: 'FTRL_17_A_6',
          navn: 'Ftrl - § 17 A-6 inntekt',
          beskrivelse: 'Folketrygdloven - § 17 A-6 inntekt',
        },
        {
          id: 'FTRL_17_A_7',
          navn: 'Ftrl - § 17 A-7',
          beskrivelse: 'Folketrygdloven - § 17 A-7',
        },
        {
          id: 'FTRL_17_A_8',
          navn: 'Ftrl - § 17 A-8',
          beskrivelse: 'Folketrygdloven - § 17 A-8',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_4',
          navn: 'Ftrl - § 21-4',
          beskrivelse: 'Folketrygdloven - § 21-4',
        },
        {
          id: 'FTRL_21_6',
          navn: 'Ftrl - § 21-6',
          beskrivelse: 'Folketrygdloven - § 21-6',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FTRL_22_7',
          navn: 'Ftrl - § 22-7',
          beskrivelse: 'Folketrygdloven - § 22-7',
        },
        {
          id: 'FTRL_22_8',
          navn: 'Ftrl - § 22-8',
          beskrivelse: 'Folketrygdloven - § 22-8',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_15_1_1',
          navn: 'Ftrl - § 22-15 1. ledd 1. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 1. pkt.',
        },
        {
          id: 'FTRL_22_15_1_2',
          navn: 'Ftrl - § 22-15 1. ledd 2. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 2. pkt.',
        },
        {
          id: 'FTRL_22_15_2',
          navn: 'Ftrl - § 22-15 2. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 2. ledd',
        },
        {
          id: 'FTRL_22_15_4',
          navn: 'Ftrl - § 22-15 4. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 4. ledd',
        },
        {
          id: 'FTRL_22_15_5',
          navn: 'Ftrl - § 22-15 5. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 5. ledd',
        },
        {
          id: 'FTRL_22_15_6',
          navn: 'Ftrl - § 22-15 6. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 6. ledd',
        },
        {
          id: 'FTRL_22_16',
          navn: 'Ftrl - § 22-16',
          beskrivelse: 'Folketrygdloven - § 22-16',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_2',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 2 unntak aktivitetsplikt',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 2 unntak aktivitetsplikt',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_3',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 3 utvidet aktivitetskrav',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 3 utvidet aktivitetskrav',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_4',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 4 reell arbeidssøker',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 4 reell arbeidssøker',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_5',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 5 utdanning',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 5 utdanning',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_6',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 6',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 6',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_7',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 7',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 7',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_8',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 8 opphør',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 8 opphør',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_9',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 9 etteroppgjør',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 9 etteroppgjør',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_10',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 10 endringer i inntekt',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 10 endringer i inntekt',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_36',
          navn: 'Fvl - § 36',
          beskrivelse: 'Forvaltningsloven - § 36',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
        {
          id: 'EOES_AVTALEN_BEREGNING',
          navn: 'EØS-avtalen - EØS-avtalen - beregning',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - beregning',
        },
        {
          id: 'EOES_AVTALEN_MEDLEMSKAP_TRYGDETID',
          navn: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
        },
      ],
    },
    {
      id: '52',
      navn: 'Gjenlevende - Omstillingsstønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '485',
              navn: '§ 1-5',
            },
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '418',
              navn: '§ 2-5',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '486',
              navn: '§ 3-2',
            },
            {
              id: '487',
              navn: '§ 3-3',
            },
            {
              id: '488',
              navn: '§ 3-5',
            },
            {
              id: '489',
              navn: '§ 3-7',
            },
            {
              id: '490',
              navn: '§ 3-8',
            },
            {
              id: '491',
              navn: '§ 3-9',
            },
            {
              id: '492',
              navn: '§ 3-10',
            },
            {
              id: '493',
              navn: '§ 3-11',
            },
            {
              id: '494',
              navn: '§ 3-12',
            },
            {
              id: '495',
              navn: '§ 3-13',
            },
            {
              id: '496',
              navn: '§ 3-14',
            },
            {
              id: '497',
              navn: '§ 3-15',
            },
            {
              id: '498',
              navn: '§ 3-16',
            },
            {
              id: '499',
              navn: '§ 3-17',
            },
            {
              id: '500',
              navn: '§ 3-18',
            },
            {
              id: '501',
              navn: '§ 3-19',
            },
            {
              id: '502',
              navn: '§ 3-22',
            },
            {
              id: '503',
              navn: '§ 3-23',
            },
            {
              id: '552',
              navn: '§ 17-2',
            },
            {
              id: '553',
              navn: '§ 17-3',
            },
            {
              id: 'FTRL_17_4_1',
              navn: '§ 17-4 første ledd',
            },
            {
              id: 'FTRL_17_4_2',
              navn: '§ 17-4 andre ledd',
            },
            {
              id: 'FTRL_17_5_1',
              navn: '§ 17-5 første ledd',
            },
            {
              id: 'FTRL_17_5_2',
              navn: '§ 17-5 andre ledd',
            },
            {
              id: 'FTRL_17_5_3',
              navn: '§ 17-5 tredje ledd',
            },
            {
              id: 'FTRL_17_6_NY',
              navn: '§ 17-6',
            },
            {
              id: 'FTRL_17_7_NY',
              navn: '§ 17-7',
            },
            {
              id: 'FTRL_17_8_NY',
              navn: '§ 17-8',
            },
            {
              id: 'FTRL_17_9_NY',
              navn: '§ 17-9 inntekt',
            },
            {
              id: '560',
              navn: '§ 17-10 tilleggsstønader',
            },
            {
              id: '561',
              navn: '§ 17-11',
            },
            {
              id: '562',
              navn: '§ 17-12',
            },
            {
              id: '564',
              navn: '§ 17-14',
            },
            {
              id: 'FTRL_17_15',
              navn: '§ 17-15 familiepleier',
            },
            {
              id: '565',
              navn: '§ 17 A-1',
            },
            {
              id: '566',
              navn: '§ 17 A-2',
            },
            {
              id: '567',
              navn: '§ 17 A-3 stønadsperiode',
            },
            {
              id: '568',
              navn: '§ 17 A-4',
            },
            {
              id: '569',
              navn: '§ 17 A-5 bortfall',
            },
            {
              id: '570',
              navn: '§ 17 A-6 inntekt',
            },
            {
              id: '571',
              navn: '§ 17 A-7',
            },
            {
              id: '572',
              navn: '§ 17 A-8',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '529',
              navn: '§ 21-4',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '69',
            navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17',
            beskrivelse:
              'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17',
          },
          registreringshjemler: [
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_2',
              navn: '§ 2',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_3',
              navn: '§ 3',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_4',
              navn: '§ 4',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_5',
              navn: '§ 5',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_6',
              navn: '§ 6',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_7',
              navn: '§ 7',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_8',
              navn: '§ 8',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_9',
              navn: '§ 9',
            },
            {
              id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_10',
              navn: '§ 10',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '530',
              navn: 'art. 1',
            },
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '379',
              navn: 'art. 50',
            },
            {
              id: '380',
              navn: 'art. 51',
            },
            {
              id: '381',
              navn: 'art. 52',
            },
            {
              id: '531',
              navn: 'art. 53',
            },
            {
              id: '532',
              navn: 'art. 54',
            },
            {
              id: '533',
              navn: 'art. 55',
            },
            {
              id: '534',
              navn: 'art. 56',
            },
            {
              id: '382',
              navn: 'art. 57',
            },
            {
              id: '383',
              navn: 'art. 58',
            },
            {
              id: '535',
              navn: 'art. 59',
            },
            {
              id: '536',
              navn: 'art. 60',
            },
            {
              id: '385',
              navn: 'art. 70',
            },
            {
              id: '386',
              navn: 'art. 87',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '537',
              navn: 'art. 10',
            },
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '314',
              navn: 'art. 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '20',
            navn: 'Forordning 1408/71',
            beskrivelse: 'Forordning 1408/71',
          },
          registreringshjemler: [
            {
              id: '395',
              navn: 'Forordning 1408/71',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '23',
            navn: 'Trygdeavtaler med England',
            beskrivelse: 'Trygdeavtaler med England',
          },
          registreringshjemler: [
            {
              id: '539',
              navn: 'Trygdeavtaler med England',
            },
          ],
        },
        {
          lovkilde: {
            id: '24',
            navn: 'Trygdeavtaler med USA',
            beskrivelse: 'Trygdeavtaler med USA',
          },
          registreringshjemler: [
            {
              id: '540',
              navn: 'Trygdeavtaler med USA',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_17_2',
          navn: 'Ftrl - § 17-2',
          beskrivelse: 'Folketrygdloven - § 17-2',
        },
        {
          id: 'FTRL_17_3',
          navn: 'Ftrl - § 17-3',
          beskrivelse: 'Folketrygdloven - § 17-3',
        },
        {
          id: 'FTRL_17_4_1',
          navn: 'Ftrl - § 17-4 første ledd',
          beskrivelse: 'Folketrygdloven - § 17-4 første ledd',
        },
        {
          id: 'FTRL_17_4_2',
          navn: 'Ftrl - § 17-4 andre ledd',
          beskrivelse: 'Folketrygdloven - § 17-4 andre ledd',
        },
        {
          id: 'FTRL_17_5_1',
          navn: 'Ftrl - § 17-5 første ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 første ledd',
        },
        {
          id: 'FTRL_17_5_2',
          navn: 'Ftrl - § 17-5 andre ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 andre ledd',
        },
        {
          id: 'FTRL_17_5_3',
          navn: 'Ftrl - § 17-5 tredje ledd',
          beskrivelse: 'Folketrygdloven - § 17-5 tredje ledd',
        },
        {
          id: 'FTRL_17_6_NY',
          navn: 'Ftrl - § 17-6',
          beskrivelse: 'Folketrygdloven - § 17-6',
        },
        {
          id: 'FTRL_17_7_NY',
          navn: 'Ftrl - § 17-7',
          beskrivelse: 'Folketrygdloven - § 17-7',
        },
        {
          id: 'FTRL_17_8_NY',
          navn: 'Ftrl - § 17-8',
          beskrivelse: 'Folketrygdloven - § 17-8',
        },
        {
          id: 'FTRL_17_9_NY',
          navn: 'Ftrl - § 17-9 inntekt',
          beskrivelse: 'Folketrygdloven - § 17-9 inntekt',
        },
        {
          id: 'FTRL_17_10',
          navn: 'Ftrl - § 17-10 tilleggsstønader',
          beskrivelse: 'Folketrygdloven - § 17-10 tilleggsstønader',
        },
        {
          id: 'FTRL_17_11',
          navn: 'Ftrl - § 17-11',
          beskrivelse: 'Folketrygdloven - § 17-11',
        },
        {
          id: 'FTRL_17_12',
          navn: 'Ftrl - § 17-12',
          beskrivelse: 'Folketrygdloven - § 17-12',
        },
        {
          id: 'FTRL_17_14',
          navn: 'Ftrl - § 17-14',
          beskrivelse: 'Folketrygdloven - § 17-14',
        },
        {
          id: 'FTRL_17_15',
          navn: 'Ftrl - § 17-15 familiepleier',
          beskrivelse: 'Folketrygdloven - § 17-15 familiepleier',
        },
        {
          id: 'FTRL_1_5',
          navn: 'Ftrl - § 1-5',
          beskrivelse: 'Folketrygdloven - § 1-5',
        },
        {
          id: 'FTRL_2_1',
          navn: 'Ftrl - § 2-1',
          beskrivelse: 'Folketrygdloven - § 2-1',
        },
        {
          id: 'FTRL_2_2',
          navn: 'Ftrl - § 2-2',
          beskrivelse: 'Folketrygdloven - § 2-2',
        },
        {
          id: 'FTRL_2_5',
          navn: 'Ftrl - § 2-5',
          beskrivelse: 'Folketrygdloven - § 2-5',
        },
        {
          id: 'FTRL_2_13',
          navn: 'Ftrl - § 2-13',
          beskrivelse: 'Folketrygdloven - § 2-13',
        },
        {
          id: 'FTRL_2_14',
          navn: 'Ftrl - § 2-14',
          beskrivelse: 'Folketrygdloven - § 2-14',
        },
        {
          id: 'FTRL_3_3',
          navn: 'Ftrl - § 3-3',
          beskrivelse: 'Folketrygdloven - § 3-3',
        },
        {
          id: 'FTRL_3_5_TRYGDETID',
          navn: 'Ftrl - § 3-5 (trygdetid)',
          beskrivelse: 'Folketrygdloven - § 3-5 (trygdetid)',
        },
        {
          id: 'FTRL_3_7',
          navn: 'Ftrl - § 3-7',
          beskrivelse: 'Folketrygdloven - § 3-7',
        },
        {
          id: 'FTRL_3_8',
          navn: 'Ftrl - § 3-8',
          beskrivelse: 'Folketrygdloven - § 3-8',
        },
        {
          id: 'FTRL_3_9',
          navn: 'Ftrl - § 3-9',
          beskrivelse: 'Folketrygdloven - § 3-9',
        },
        {
          id: 'FTRL_3_10',
          navn: 'Ftrl - § 3-10',
          beskrivelse: 'Folketrygdloven - § 3-10',
        },
        {
          id: 'FTRL_3_11',
          navn: 'Ftrl - § 3-11',
          beskrivelse: 'Folketrygdloven - § 3-11',
        },
        {
          id: 'FTRL_3_12',
          navn: 'Ftrl - § 3-12',
          beskrivelse: 'Folketrygdloven - § 3-12',
        },
        {
          id: 'FTRL_3_13',
          navn: 'Ftrl - § 3-13',
          beskrivelse: 'Folketrygdloven - § 3-13',
        },
        {
          id: 'FTRL_3_14',
          navn: 'Ftrl - § 3-14',
          beskrivelse: 'Folketrygdloven - § 3-14',
        },
        {
          id: 'FTRL_3_15',
          navn: 'Ftrl - § 3-15',
          beskrivelse: 'Folketrygdloven - § 3-15',
        },
        {
          id: 'FTRL_3_16',
          navn: 'Ftrl - § 3-16',
          beskrivelse: 'Folketrygdloven - § 3-16',
        },
        {
          id: 'FTRL_3_17',
          navn: 'Ftrl - § 3-17',
          beskrivelse: 'Folketrygdloven - § 3-17',
        },
        {
          id: 'FTRL_3_18',
          navn: 'Ftrl - § 3-18',
          beskrivelse: 'Folketrygdloven - § 3-18',
        },
        {
          id: 'FTRL_3_19',
          navn: 'Ftrl - § 3-19',
          beskrivelse: 'Folketrygdloven - § 3-19',
        },
        {
          id: 'FTRL_3_22',
          navn: 'Ftrl - § 3-22',
          beskrivelse: 'Folketrygdloven - § 3-22',
        },
        {
          id: 'FTRL_3_23',
          navn: 'Ftrl - § 3-23',
          beskrivelse: 'Folketrygdloven - § 3-23',
        },
        {
          id: 'FTRL_17_A_1',
          navn: 'Ftrl - § 17 A-1',
          beskrivelse: 'Folketrygdloven - § 17 A-1',
        },
        {
          id: 'FTRL_17_A_2',
          navn: 'Ftrl - § 17 A-2',
          beskrivelse: 'Folketrygdloven - § 17 A-2',
        },
        {
          id: 'FTRL_17_A_3',
          navn: 'Ftrl - § 17 A-3 stønadsperiode',
          beskrivelse: 'Folketrygdloven - § 17 A-3 stønadsperiode',
        },
        {
          id: 'FTRL_17_A_4',
          navn: 'Ftrl - § 17 A-4',
          beskrivelse: 'Folketrygdloven - § 17 A-4',
        },
        {
          id: 'FTRL_17_A_5',
          navn: 'Ftrl - § 17 A-5 bortfall',
          beskrivelse: 'Folketrygdloven - § 17 A-5 bortfall',
        },
        {
          id: 'FTRL_17_A_6',
          navn: 'Ftrl - § 17 A-6 inntekt',
          beskrivelse: 'Folketrygdloven - § 17 A-6 inntekt',
        },
        {
          id: 'FTRL_17_A_7',
          navn: 'Ftrl - § 17 A-7',
          beskrivelse: 'Folketrygdloven - § 17 A-7',
        },
        {
          id: 'FTRL_17_A_8',
          navn: 'Ftrl - § 17 A-8',
          beskrivelse: 'Folketrygdloven - § 17 A-8',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_4',
          navn: 'Ftrl - § 21-4',
          beskrivelse: 'Folketrygdloven - § 21-4',
        },
        {
          id: 'FTRL_21_6',
          navn: 'Ftrl - § 21-6',
          beskrivelse: 'Folketrygdloven - § 21-6',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FTRL_22_7',
          navn: 'Ftrl - § 22-7',
          beskrivelse: 'Folketrygdloven - § 22-7',
        },
        {
          id: 'FTRL_22_8',
          navn: 'Ftrl - § 22-8',
          beskrivelse: 'Folketrygdloven - § 22-8',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_15_1_1',
          navn: 'Ftrl - § 22-15 1. ledd 1. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 1. pkt.',
        },
        {
          id: 'FTRL_22_15_1_2',
          navn: 'Ftrl - § 22-15 1. ledd 2. pkt.',
          beskrivelse: 'Folketrygdloven - § 22-15 1. ledd 2. pkt.',
        },
        {
          id: 'FTRL_22_15_2',
          navn: 'Ftrl - § 22-15 2. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 2. ledd',
        },
        {
          id: 'FTRL_22_15_4',
          navn: 'Ftrl - § 22-15 4. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 4. ledd',
        },
        {
          id: 'FTRL_22_15_5',
          navn: 'Ftrl - § 22-15 5. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 5. ledd',
        },
        {
          id: 'FTRL_22_15_6',
          navn: 'Ftrl - § 22-15 6. ledd',
          beskrivelse: 'Folketrygdloven - § 22-15 6. ledd',
        },
        {
          id: 'FTRL_22_16',
          navn: 'Ftrl - § 22-16',
          beskrivelse: 'Folketrygdloven - § 22-16',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_2',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 2 unntak aktivitetsplikt',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 2 unntak aktivitetsplikt',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_3',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 3 utvidet aktivitetskrav',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 3 utvidet aktivitetskrav',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_4',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 4 reell arbeidssøker',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 4 reell arbeidssøker',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_5',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 5 utdanning',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 5 utdanning',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_6',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 6',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 6',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_7',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 7',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 7',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_8',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 8 opphør',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 8 opphør',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_9',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 9 etteroppgjør',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 9 etteroppgjør',
        },
        {
          id: 'FS_YTELSE_TIL_GJENLEVENDE_EKTEFELLE_OG_TIDLIGERE_FAMILIEPLEIER_10',
          navn: 'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 10 endringer i inntekt',
          beskrivelse:
            'Forskrift om ytelser til gjenlevende ektefelle og tidligere familiepleier etter folketrygdloven kapittel 17 - § 10 endringer i inntekt',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_36',
          navn: 'Fvl - § 36',
          beskrivelse: 'Forvaltningsloven - § 36',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
        {
          id: 'EOES_AVTALEN_BEREGNING',
          navn: 'EØS-avtalen - EØS-avtalen - beregning',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - beregning',
        },
        {
          id: 'EOES_AVTALEN_MEDLEMSKAP_TRYGDETID',
          navn: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
          beskrivelse: 'EØS-avtalen - EØS-avtalen - medlemskap/trygdetid',
        },
      ],
    },
    {
      id: '19',
      navn: 'Gravferdsstønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '460',
              navn: '§ 7-2',
            },
            {
              id: '461',
              navn: '§ 7-3',
            },
            {
              id: '462',
              navn: '§ 7-4',
            },
            {
              id: '463',
              navn: '§ 7-5',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_7_2',
          navn: 'Ftrl - § 7-2',
          beskrivelse: 'Folketrygdloven - § 7-2',
        },
        {
          id: 'FTRL_7_3',
          navn: 'Ftrl - § 7-3',
          beskrivelse: 'Folketrygdloven - § 7-3',
        },
        {
          id: 'FTRL_22_13_2',
          navn: 'Ftrl - § 22-13 2. ledd',
          beskrivelse: 'Folketrygdloven - § 22-13 2. ledd',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '21',
      navn: 'Grunn- og hjelpestønad - Grunnstønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '444',
              navn: '§ 6-2',
            },
            {
              id: '445',
              navn: '§ 6-3 første ledd a',
            },
            {
              id: '446',
              navn: '§ 6-3 første ledd b',
            },
            {
              id: '447',
              navn: '§ 6-3 første ledd c',
            },
            {
              id: '448',
              navn: '§ 6-3 første ledd f',
            },
            {
              id: '449',
              navn: '§ 6-3 første ledd g',
            },
            {
              id: '450',
              navn: '§ 6-3 første ledd h',
            },
            {
              id: '451',
              navn: '§ 6-3 andre ledd',
            },
            {
              id: 'FTRL_6_3J',
              navn: '§ 6-3 tredje ledd',
            },
            {
              id: '452',
              navn: '§ 6-3 fjerde ledd',
            },
            {
              id: '453',
              navn: '§ 6-3 femte ledd',
            },
            {
              id: '454',
              navn: '§ 6-6',
            },
            {
              id: '455',
              navn: '§ 6-7',
            },
            {
              id: '456',
              navn: '§ 6-8',
            },
            {
              id: '457',
              navn: '§ 6-9',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '313',
              navn: 'art. 21',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4401',
          navn: 'Nav Arbeid og ytelser Sarpsborg',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_6_2',
          navn: 'Ftrl - § 6-2',
          beskrivelse: 'Folketrygdloven - § 6-2',
        },
        {
          id: 'FTRL_6_3',
          navn: 'Ftrl - § 6-3',
          beskrivelse: 'Folketrygdloven - § 6-3',
        },
        {
          id: 'FTRL_6_3_A',
          navn: 'Ftrl - § 6-3 a',
          beskrivelse: 'Folketrygdloven - § 6-3 a',
        },
        {
          id: 'FTRL_6_3_B',
          navn: 'Ftrl - § 6-3 b',
          beskrivelse: 'Folketrygdloven - § 6-3 b',
        },
        {
          id: 'FTRL_6_3_C',
          navn: 'Ftrl - § 6-3 c',
          beskrivelse: 'Folketrygdloven - § 6-3 c',
        },
        {
          id: 'FTRL_6_3_F',
          navn: 'Ftrl - § 6-3 f',
          beskrivelse: 'Folketrygdloven - § 6-3 f',
        },
        {
          id: 'FTRL_6_3_G',
          navn: 'Ftrl - § 6-3 g',
          beskrivelse: 'Folketrygdloven - § 6-3 g',
        },
        {
          id: 'FTRL_6_3_H',
          navn: 'Ftrl - § 6-3 h',
          beskrivelse: 'Folketrygdloven - § 6-3 h',
        },
        {
          id: 'FTRL_6_4',
          navn: 'Ftrl - § 6-4',
          beskrivelse: 'Folketrygdloven - § 6-4',
        },
        {
          id: 'FTRL_6_5',
          navn: 'Ftrl - § 6-5',
          beskrivelse: 'Folketrygdloven - § 6-5',
        },
        {
          id: 'FTRL_6_6',
          navn: 'Ftrl - § 6-6',
          beskrivelse: 'Folketrygdloven - § 6-6',
        },
        {
          id: 'FTRL_6_7',
          navn: 'Ftrl - § 6-7',
          beskrivelse: 'Folketrygdloven - § 6-7',
        },
        {
          id: 'FTRL_6_8',
          navn: 'Ftrl - § 6-8',
          beskrivelse: 'Folketrygdloven - § 6-8',
        },
        {
          id: 'FTRL_21_4',
          navn: 'Ftrl - § 21-4',
          beskrivelse: 'Folketrygdloven - § 21-4',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '20',
      navn: 'Grunn- og hjelpestønad - Hjelpestønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '444',
              navn: '§ 6-2',
            },
            {
              id: '458',
              navn: '§ 6-4',
            },
            {
              id: '459',
              navn: '§ 6-5',
            },
            {
              id: '454',
              navn: '§ 6-6',
            },
            {
              id: '455',
              navn: '§ 6-7',
            },
            {
              id: '456',
              navn: '§ 6-8',
            },
            {
              id: '457',
              navn: '§ 6-9',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '313',
              navn: 'art. 21',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4401',
          navn: 'Nav Arbeid og ytelser Sarpsborg',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_6_2',
          navn: 'Ftrl - § 6-2',
          beskrivelse: 'Folketrygdloven - § 6-2',
        },
        {
          id: 'FTRL_6_3',
          navn: 'Ftrl - § 6-3',
          beskrivelse: 'Folketrygdloven - § 6-3',
        },
        {
          id: 'FTRL_6_3_A',
          navn: 'Ftrl - § 6-3 a',
          beskrivelse: 'Folketrygdloven - § 6-3 a',
        },
        {
          id: 'FTRL_6_3_B',
          navn: 'Ftrl - § 6-3 b',
          beskrivelse: 'Folketrygdloven - § 6-3 b',
        },
        {
          id: 'FTRL_6_3_C',
          navn: 'Ftrl - § 6-3 c',
          beskrivelse: 'Folketrygdloven - § 6-3 c',
        },
        {
          id: 'FTRL_6_3_F',
          navn: 'Ftrl - § 6-3 f',
          beskrivelse: 'Folketrygdloven - § 6-3 f',
        },
        {
          id: 'FTRL_6_3_G',
          navn: 'Ftrl - § 6-3 g',
          beskrivelse: 'Folketrygdloven - § 6-3 g',
        },
        {
          id: 'FTRL_6_3_H',
          navn: 'Ftrl - § 6-3 h',
          beskrivelse: 'Folketrygdloven - § 6-3 h',
        },
        {
          id: 'FTRL_6_4',
          navn: 'Ftrl - § 6-4',
          beskrivelse: 'Folketrygdloven - § 6-4',
        },
        {
          id: 'FTRL_6_5',
          navn: 'Ftrl - § 6-5',
          beskrivelse: 'Folketrygdloven - § 6-5',
        },
        {
          id: 'FTRL_6_6',
          navn: 'Ftrl - § 6-6',
          beskrivelse: 'Folketrygdloven - § 6-6',
        },
        {
          id: 'FTRL_6_7',
          navn: 'Ftrl - § 6-7',
          beskrivelse: 'Folketrygdloven - § 6-7',
        },
        {
          id: 'FTRL_6_8',
          navn: 'Ftrl - § 6-8',
          beskrivelse: 'Folketrygdloven - § 6-8',
        },
        {
          id: 'FTRL_21_4',
          navn: 'Ftrl - § 21-4',
          beskrivelse: 'Folketrygdloven - § 21-4',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '49',
      navn: 'Hjelpemidler - Bil og motorkjøretøy',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '2',
              navn: '§ 10-3',
            },
            {
              id: '3',
              navn: '§ 10-4',
            },
            {
              id: 'FTRL_10_5E',
              navn: '§ 10-5 Arbeid',
            },
            {
              id: 'FTRL_10_6E',
              navn: '§ 10-6 Dagligliv',
            },
            {
              id: '21',
              navn: '§ 10-7h Motorkjøretøy',
            },
            {
              id: '25',
              navn: '§ 10-8 Bortfall av rettigheter',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
          ],
        },
        {
          lovkilde: {
            id: '7',
            navn: 'Forskrift om motorkjøretøy',
            beskrivelse: 'Bilstønadsforskriften',
          },
          registreringshjemler: [
            {
              id: '95',
              navn: '§ 2 behov for heise eller rampe',
            },
            {
              id: '96',
              navn: '§ 2 sterkt begrenset gangfunksjon',
            },
            {
              id: '97',
              navn: '§ 2 utagering',
            },
            {
              id: '98',
              navn: '§ 3 transportvilkåret',
            },
            {
              id: '99',
              navn: '§ 5 regler valg av kjøretøy',
            },
            {
              id: '100',
              navn: '§ 6 rammeavtaler og prisramme',
            },
            {
              id: '101',
              navn: '§ 7 krav til registrering og førerkort',
            },
            {
              id: '102',
              navn: '§ 8 gjenanskaffelse',
            },
            {
              id: '103',
              navn: '§ 9 behovsprøving mot inntekt',
            },
            {
              id: '105',
              navn: '§ 11 tilskudd til firehjulstrekk',
            },
            {
              id: '104',
              navn: '§ 11 tilskudd til spesialutstyr',
            },
            {
              id: '106',
              navn: '§ 12 tilskudd til kjøreopplæring',
            },
            {
              id: 'FS_MOK_13',
              navn: '§ 13 Dekning av reise- og oppholdsutgifter',
            },
            {
              id: 'FS_MOK_14',
              navn: '§ 14 Reparasjoner',
            },
            {
              id: '107',
              navn: '§ 15 gjeldoppgjør',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: 'EOES_883_2004_23',
              navn: 'art. 23',
            },
            {
              id: 'EOES_883_2004_24',
              navn: 'art. 24',
            },
            {
              id: 'EOES_883_2004_25',
              navn: 'art. 25',
            },
            {
              id: 'EOES_883_2004_33',
              navn: 'art. 33',
            },
            {
              id: 'EOES_883_2004_81',
              navn: 'art. 81',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4701',
          navn: 'Nav Hjelpemiddelsentral Øst-Viken',
        },
        {
          id: '4702',
          navn: 'Nav Hjelpemiddelsentral Akershus',
        },
        {
          id: '4703',
          navn: 'Nav Hjelpemiddelsentral Oslo',
        },
        {
          id: '4704',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Elverum',
        },
        {
          id: '4705',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Gjøvik',
        },
        {
          id: '4706',
          navn: 'Nav Hjelpemiddelsentral Vest-Viken',
        },
        {
          id: '4707',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Sandefjord',
        },
        {
          id: '4708',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Skien',
        },
        {
          id: '4709',
          navn: 'Nav Hjelpemiddelsentral Agder-Arendal',
        },
        {
          id: '4710',
          navn: 'Nav Hjelpemiddelsentral Agder',
        },
        {
          id: '4711',
          navn: 'Nav Hjelpemiddelsentral Rogaland',
        },
        {
          id: '4712',
          navn: 'Nav Hjelpemiddelsentral Vestland-Bergen',
        },
        {
          id: '4714',
          navn: 'Nav Hjelpemiddelsentral Vestland-Førde',
        },
        {
          id: '4715',
          navn: 'Nav Hjelpemiddelsentral Møre og Romsdal',
        },
        {
          id: '4716',
          navn: 'Nav Hjelpemiddelsentral Trøndelag',
        },
        {
          id: '4717',
          navn: 'Nav Hjelpemiddelsentral Nord-Trøndelag',
        },
        {
          id: '4718',
          navn: 'Nav Hjelpemiddelsentral Nordland',
        },
        {
          id: '4719',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Tromsø',
        },
        {
          id: '4720',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Lakselv',
        },
        {
          id: '4408',
          navn: 'Nav Arbeid og ytelser Skien',
        },
        {
          id: '4418',
          navn: 'Nav Arbeid og ytelser Fauske',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_10_3',
          navn: 'Ftrl - § 10-3',
          beskrivelse: 'Folketrygdloven - § 10-3',
        },
        {
          id: 'FTRL_10_4',
          navn: 'Ftrl - § 10-4',
          beskrivelse: 'Folketrygdloven - § 10-4',
        },
        {
          id: 'FTRL_10_5',
          navn: 'Ftrl - § 10-5 Arbeid',
          beskrivelse: 'Folketrygdloven - § 10-5 Arbeid',
        },
        {
          id: 'FTRL_10_6',
          navn: 'Ftrl - § 10-6 Dagligliv',
          beskrivelse: 'Folketrygdloven - § 10-6 Dagligliv',
        },
        {
          id: 'FTRL_10_7H',
          navn: 'Ftrl - § 10-7h Motorkjøretøy',
          beskrivelse: 'Folketrygdloven - § 10-7h Motorkjøretøy',
        },
        {
          id: 'FTRL_10_8',
          navn: 'Ftrl - § 10-8 Bortfall av rettigheter',
          beskrivelse: 'Folketrygdloven - § 10-8 Bortfall av rettigheter',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_8',
          navn: 'Ftrl - § 21-8',
          beskrivelse: 'Folketrygdloven - § 21-8',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FS_MOK_2B',
          navn: 'Bilstønadsforskriften - § 2 behov for heise eller rampe',
          beskrivelse: 'Forskrift om motorkjøretøy - § 2 behov for heise eller rampe',
        },
        {
          id: 'FS_MOK_2C',
          navn: 'Bilstønadsforskriften - § 2 sterkt begrenset gangfunksjon',
          beskrivelse: 'Forskrift om motorkjøretøy - § 2 sterkt begrenset gangfunksjon',
        },
        {
          id: 'FS_MOK_2D',
          navn: 'Bilstønadsforskriften - § 2 utagering',
          beskrivelse: 'Forskrift om motorkjøretøy - § 2 utagering',
        },
        {
          id: 'FS_MOK_3A',
          navn: 'Bilstønadsforskriften - § 3 transportvilkåret',
          beskrivelse: 'Forskrift om motorkjøretøy - § 3 transportvilkåret',
        },
        {
          id: 'FS_MOK_5A',
          navn: 'Bilstønadsforskriften - § 5 regler valg av kjøretøy',
          beskrivelse: 'Forskrift om motorkjøretøy - § 5 regler valg av kjøretøy',
        },
        {
          id: 'FS_MOK_6A',
          navn: 'Bilstønadsforskriften - § 6 rammeavtaler og prisramme',
          beskrivelse: 'Forskrift om motorkjøretøy - § 6 rammeavtaler og prisramme',
        },
        {
          id: 'FS_MOK_7A',
          navn: 'Bilstønadsforskriften - § 7 krav til registrering og førerkort',
          beskrivelse: 'Forskrift om motorkjøretøy - § 7 krav til registrering og førerkort',
        },
        {
          id: 'FS_MOK_8A',
          navn: 'Bilstønadsforskriften - § 8 gjenanskaffelse',
          beskrivelse: 'Forskrift om motorkjøretøy - § 8 gjenanskaffelse',
        },
        {
          id: 'FS_MOK_9A',
          navn: 'Bilstønadsforskriften - § 9 behovsprøving mot inntekt',
          beskrivelse: 'Forskrift om motorkjøretøy - § 9 behovsprøving mot inntekt',
        },
        {
          id: 'FS_MOK_11A',
          navn: 'Bilstønadsforskriften - § 11 tilskudd til spesialutstyr',
          beskrivelse: 'Forskrift om motorkjøretøy - § 11 tilskudd til spesialutstyr',
        },
        {
          id: 'FS_MOK_11B',
          navn: 'Bilstønadsforskriften - § 11 tilskudd til firehjulstrekk',
          beskrivelse: 'Forskrift om motorkjøretøy - § 11 tilskudd til firehjulstrekk',
        },
        {
          id: 'FS_MOK_12A',
          navn: 'Bilstønadsforskriften - § 12 tilskudd til kjøreopplæring',
          beskrivelse: 'Forskrift om motorkjøretøy - § 12 tilskudd til kjøreopplæring',
        },
        {
          id: 'FS_MOK_13',
          navn: 'Bilstønadsforskriften - § 13 Dekning av reise- og oppholdsutgifter',
          beskrivelse: 'Forskrift om motorkjøretøy - § 13 Dekning av reise- og oppholdsutgifter',
        },
        {
          id: 'FS_MOK_14',
          navn: 'Bilstønadsforskriften - § 14 Reparasjoner',
          beskrivelse: 'Forskrift om motorkjøretøy - § 14 Reparasjoner',
        },
        {
          id: 'FS_MOK_15',
          navn: 'Bilstønadsforskriften - § 15 gjeldoppgjør',
          beskrivelse: 'Forskrift om motorkjøretøy - § 15 gjeldoppgjør',
        },
        {
          id: 'EOES_883_2004_11',
          navn: 'EØS forordning 883/2004 - art. 11',
          beskrivelse: 'EØS forordning 883/2004 - art. 11',
        },
        {
          id: 'EOES_883_2004_12',
          navn: 'EØS forordning 883/2004 - art. 12',
          beskrivelse: 'EØS forordning 883/2004 - art. 12',
        },
        {
          id: 'EOES_883_2004_13',
          navn: 'EØS forordning 883/2004 - art. 13',
          beskrivelse: 'EØS forordning 883/2004 - art. 13',
        },
        {
          id: 'EOES_883_2004_23',
          navn: 'EØS forordning 883/2004 - art. 23',
          beskrivelse: 'EØS forordning 883/2004 - art. 23',
        },
        {
          id: 'EOES_883_2004_24',
          navn: 'EØS forordning 883/2004 - art. 24',
          beskrivelse: 'EØS forordning 883/2004 - art. 24',
        },
        {
          id: 'EOES_883_2004_25',
          navn: 'EØS forordning 883/2004 - art. 25',
          beskrivelse: 'EØS forordning 883/2004 - art. 25',
        },
        {
          id: 'EOES_883_2004_33',
          navn: 'EØS forordning 883/2004 - art. 33',
          beskrivelse: 'EØS forordning 883/2004 - art. 33',
        },
        {
          id: 'EOES_883_2004_81',
          navn: 'EØS forordning 883/2004 - art. 81',
          beskrivelse: 'EØS forordning 883/2004 - art. 81',
        },
        {
          id: 'GJ_F_FORD_987_2009_11',
          navn: 'Gjennomføringsforordning 987/2009 - art. 11',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 11',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
        {
          id: 'FVL_11',
          navn: 'Fvl - § 11',
          beskrivelse: 'Forvaltningsloven - § 11',
        },
        {
          id: 'FVL_12',
          navn: 'Fvl - § 12',
          beskrivelse: 'Forvaltningsloven - § 12',
        },
        {
          id: 'FVL_14',
          navn: 'Fvl - § 14',
          beskrivelse: 'Forvaltningsloven - § 14',
        },
        {
          id: 'FVL_16',
          navn: 'Fvl - § 16',
          beskrivelse: 'Forvaltningsloven - § 16',
        },
        {
          id: 'FVL_17',
          navn: 'Fvl - § 17',
          beskrivelse: 'Forvaltningsloven - § 17',
        },
        {
          id: 'FVL_18_19',
          navn: 'Fvl - §§ 18 og 19',
          beskrivelse: 'Forvaltningsloven - §§ 18 og 19',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_24',
          navn: 'Fvl - § 24',
          beskrivelse: 'Forvaltningsloven - § 24',
        },
        {
          id: 'FVL_25',
          navn: 'Fvl - § 25',
          beskrivelse: 'Forvaltningsloven - § 25',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_41',
          navn: 'Fvl - § 41',
          beskrivelse: 'Forvaltningsloven - § 41',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'TRRL_2',
          navn: 'Trrl - § 2',
          beskrivelse: 'Trygderettsloven - § 2',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
        {
          id: 'TRRL_12',
          navn: 'Trrl - § 12',
          beskrivelse: 'Trygderettsloven - § 12',
        },
        {
          id: 'TRRL_14',
          navn: 'Trrl - § 14',
          beskrivelse: 'Trygderettsloven - § 14',
        },
      ],
    },
    {
      id: '50',
      navn: 'Hjelpemidler - Ortopediske',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '2',
              navn: '§ 10-3',
            },
            {
              id: '3',
              navn: '§ 10-4',
            },
            {
              id: 'FTRL_10_5E',
              navn: '§ 10-5 Arbeid',
            },
            {
              id: 'FTRL_10_6E',
              navn: '§ 10-6 Dagligliv',
            },
            {
              id: '22',
              navn: '§ 10-7i Ortopediske hjelpemidler',
            },
            {
              id: '25',
              navn: '§ 10-8 Bortfall av rettigheter',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
          ],
        },
        {
          lovkilde: {
            id: '4',
            navn: 'Forskrift om ortopediske hjelpemidler mm.',
            beskrivelse: 'Forskrift om dekning av utgifter til proteser mv.',
          },
          registreringshjemler: [
            {
              id: '61',
              navn: '§ 1 fotsenger',
            },
            {
              id: '59',
              navn: '§ 1 ortopediske proteser',
            },
            {
              id: '60',
              navn: '§ 1 ortoser',
            },
            {
              id: 'FS_ORT_HJE_MM_2F',
              navn: '§ 2 ortopediske sko',
            },
            {
              id: '67',
              navn: '§ 3 søknad og gyldighetstid',
            },
            {
              id: 'FS_ORT_HJE_MM_4A',
              navn: '§ 4 Pris- og leveringsavtaler',
            },
            {
              id: '68',
              navn: '§ 5 brystproteser',
            },
            {
              id: '70',
              navn: '§ 6 ansiktsdefektprotese',
            },
            {
              id: '71',
              navn: '§ 7 øyeprotese',
            },
            {
              id: 'FS_ORT_HJE_MM_8G',
              navn: '§ 8 parykk',
            },
            {
              id: '78',
              navn: '§ 9a overekstremitetsortoser ved revmatisme',
            },
            {
              id: '77',
              navn: '§ 9 alminnelig fottøy',
            },
            {
              id: 'FS_ORT_HJE_MM_10A',
              navn: '§ 10 Forhåndstilsagn',
            },
            {
              id: '79',
              navn: '§ 12 reise',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: 'EOES_883_2004_23',
              navn: 'art. 23',
            },
            {
              id: 'EOES_883_2004_24',
              navn: 'art. 24',
            },
            {
              id: 'EOES_883_2004_25',
              navn: 'art. 25',
            },
            {
              id: 'EOES_883_2004_33',
              navn: 'art. 33',
            },
            {
              id: 'EOES_883_2004_81',
              navn: 'art. 81',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4701',
          navn: 'Nav Hjelpemiddelsentral Øst-Viken',
        },
        {
          id: '4702',
          navn: 'Nav Hjelpemiddelsentral Akershus',
        },
        {
          id: '4703',
          navn: 'Nav Hjelpemiddelsentral Oslo',
        },
        {
          id: '4704',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Elverum',
        },
        {
          id: '4705',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Gjøvik',
        },
        {
          id: '4706',
          navn: 'Nav Hjelpemiddelsentral Vest-Viken',
        },
        {
          id: '4707',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Sandefjord',
        },
        {
          id: '4708',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Skien',
        },
        {
          id: '4709',
          navn: 'Nav Hjelpemiddelsentral Agder-Arendal',
        },
        {
          id: '4710',
          navn: 'Nav Hjelpemiddelsentral Agder',
        },
        {
          id: '4711',
          navn: 'Nav Hjelpemiddelsentral Rogaland',
        },
        {
          id: '4712',
          navn: 'Nav Hjelpemiddelsentral Vestland-Bergen',
        },
        {
          id: '4714',
          navn: 'Nav Hjelpemiddelsentral Vestland-Førde',
        },
        {
          id: '4715',
          navn: 'Nav Hjelpemiddelsentral Møre og Romsdal',
        },
        {
          id: '4716',
          navn: 'Nav Hjelpemiddelsentral Trøndelag',
        },
        {
          id: '4717',
          navn: 'Nav Hjelpemiddelsentral Nord-Trøndelag',
        },
        {
          id: '4718',
          navn: 'Nav Hjelpemiddelsentral Nordland',
        },
        {
          id: '4719',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Tromsø',
        },
        {
          id: '4720',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Lakselv',
        },
        {
          id: '4408',
          navn: 'Nav Arbeid og ytelser Skien',
        },
        {
          id: '4418',
          navn: 'Nav Arbeid og ytelser Fauske',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_10_3',
          navn: 'Ftrl - § 10-3',
          beskrivelse: 'Folketrygdloven - § 10-3',
        },
        {
          id: 'FTRL_10_4',
          navn: 'Ftrl - § 10-4',
          beskrivelse: 'Folketrygdloven - § 10-4',
        },
        {
          id: 'FTRL_10_5',
          navn: 'Ftrl - § 10-5 Arbeid',
          beskrivelse: 'Folketrygdloven - § 10-5 Arbeid',
        },
        {
          id: 'FTRL_10_6',
          navn: 'Ftrl - § 10-6 Dagligliv',
          beskrivelse: 'Folketrygdloven - § 10-6 Dagligliv',
        },
        {
          id: 'FTRL_10_7I',
          navn: 'Ftrl - § 10-7i Ortopediske hjelpemidler',
          beskrivelse: 'Folketrygdloven - § 10-7i Ortopediske hjelpemidler',
        },
        {
          id: 'FTRL_10_8',
          navn: 'Ftrl - § 10-8 Bortfall av rettigheter',
          beskrivelse: 'Folketrygdloven - § 10-8 Bortfall av rettigheter',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_8',
          navn: 'Ftrl - § 21-8',
          beskrivelse: 'Folketrygdloven - § 21-8',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FS_ORT_HJE_MM_1A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 1 ortopediske proteser',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 1 ortopediske proteser',
        },
        {
          id: 'FS_ORT_HJE_MM_1B',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 1 ortoser',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 1 ortoser',
        },
        {
          id: 'FS_ORT_HJE_MM_1C',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 1 fotsenger',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 1 fotsenger',
        },
        {
          id: 'FS_ORT_HJE_MM_2F',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 2 ortopediske sko',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 2 ortopediske sko',
        },
        {
          id: 'FS_ORT_HJE_MM_3A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 3 søknad og gyldighetstid',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 3 søknad og gyldighetstid',
        },
        {
          id: 'FS_ORT_HJE_MM_4A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 4 Pris- og leveringsavtaler',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 4 Pris- og leveringsavtaler',
        },
        {
          id: 'FS_ORT_HJE_MM_5A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 5 brystproteser',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 5 brystproteser',
        },
        {
          id: 'FS_ORT_HJE_MM_6A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 6 ansiktsdefektprotese',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 6 ansiktsdefektprotese',
        },
        {
          id: 'FS_ORT_HJE_MM_7A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 7 øyeprotese',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 7 øyeprotese',
        },
        {
          id: 'FS_ORT_HJE_MM_7A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 7 øyeprotese',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 7 øyeprotese',
        },
        {
          id: 'FS_ORT_HJE_MM_8G',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 8 parykk',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 8 parykk',
        },
        {
          id: 'FS_ORT_HJE_MM_9A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 9 alminnelig fottøy',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 9 alminnelig fottøy',
        },
        {
          id: 'FS_ORT_HJE_MM_9AA',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 9a overekstremitetsortoser ved revmatisme',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 9a overekstremitetsortoser ved revmatisme',
        },
        {
          id: 'FS_ORT_HJE_MM_10A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 10 Forhåndstilsagn',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 10 Forhåndstilsagn',
        },
        {
          id: 'FS_ORT_HJE_MM_12A',
          navn: 'Forskrift om dekning av utgifter til proteser mv. - § 12 reise',
          beskrivelse: 'Forskrift om ortopediske hjelpemidler mm. - § 12 reise',
        },
        {
          id: 'EOES_883_2004_11',
          navn: 'EØS forordning 883/2004 - art. 11',
          beskrivelse: 'EØS forordning 883/2004 - art. 11',
        },
        {
          id: 'EOES_883_2004_12',
          navn: 'EØS forordning 883/2004 - art. 12',
          beskrivelse: 'EØS forordning 883/2004 - art. 12',
        },
        {
          id: 'EOES_883_2004_13',
          navn: 'EØS forordning 883/2004 - art. 13',
          beskrivelse: 'EØS forordning 883/2004 - art. 13',
        },
        {
          id: 'EOES_883_2004_23',
          navn: 'EØS forordning 883/2004 - art. 23',
          beskrivelse: 'EØS forordning 883/2004 - art. 23',
        },
        {
          id: 'EOES_883_2004_24',
          navn: 'EØS forordning 883/2004 - art. 24',
          beskrivelse: 'EØS forordning 883/2004 - art. 24',
        },
        {
          id: 'EOES_883_2004_25',
          navn: 'EØS forordning 883/2004 - art. 25',
          beskrivelse: 'EØS forordning 883/2004 - art. 25',
        },
        {
          id: 'EOES_883_2004_33',
          navn: 'EØS forordning 883/2004 - art. 33',
          beskrivelse: 'EØS forordning 883/2004 - art. 33',
        },
        {
          id: 'EOES_883_2004_81',
          navn: 'EØS forordning 883/2004 - art. 81',
          beskrivelse: 'EØS forordning 883/2004 - art. 81',
        },
        {
          id: 'GJ_F_FORD_987_2009_11',
          navn: 'Gjennomføringsforordning 987/2009 - art. 11',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 11',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
        {
          id: 'FVL_11',
          navn: 'Fvl - § 11',
          beskrivelse: 'Forvaltningsloven - § 11',
        },
        {
          id: 'FVL_12',
          navn: 'Fvl - § 12',
          beskrivelse: 'Forvaltningsloven - § 12',
        },
        {
          id: 'FVL_14',
          navn: 'Fvl - § 14',
          beskrivelse: 'Forvaltningsloven - § 14',
        },
        {
          id: 'FVL_16',
          navn: 'Fvl - § 16',
          beskrivelse: 'Forvaltningsloven - § 16',
        },
        {
          id: 'FVL_17',
          navn: 'Fvl - § 17',
          beskrivelse: 'Forvaltningsloven - § 17',
        },
        {
          id: 'FVL_18_19',
          navn: 'Fvl - §§ 18 og 19',
          beskrivelse: 'Forvaltningsloven - §§ 18 og 19',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_24',
          navn: 'Fvl - § 24',
          beskrivelse: 'Forvaltningsloven - § 24',
        },
        {
          id: 'FVL_25',
          navn: 'Fvl - § 25',
          beskrivelse: 'Forvaltningsloven - § 25',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_41',
          navn: 'Fvl - § 41',
          beskrivelse: 'Forvaltningsloven - § 41',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'TRRL_2',
          navn: 'Trrl - § 2',
          beskrivelse: 'Trygderettsloven - § 2',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
        {
          id: 'TRRL_12',
          navn: 'Trrl - § 12',
          beskrivelse: 'Trygderettsloven - § 12',
        },
        {
          id: 'TRRL_14',
          navn: 'Trrl - § 14',
          beskrivelse: 'Trygderettsloven - § 14',
        },
      ],
    },
    {
      id: '22',
      navn: 'Hjelpemidler - Tekniske',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '2',
              navn: '§ 10-3',
            },
            {
              id: '3',
              navn: '§ 10-4',
            },
            {
              id: 'FTRL_10_5E',
              navn: '§ 10-5 Arbeid',
            },
            {
              id: 'FTRL_10_6E',
              navn: '§ 10-6 Dagligliv',
            },
            {
              id: '11',
              navn: '§ 10-7a Hjelpemidler',
            },
            {
              id: '14',
              navn: '§ 10-7a Hjelpemidler med indirekte avhjelpsfunksjon og behandlingsformål',
            },
            {
              id: '13',
              navn: '§ 10-7a Ordinært og vanlig utstyr',
            },
            {
              id: '12',
              navn: '§ 10-7a Skolehjelpemidler',
            },
            {
              id: 'FTRL_10_7AE',
              navn: '§ 10-7a Stønad til briller til barn',
            },
            {
              id: '15',
              navn: '§ 10-7b Høreapparat',
            },
            {
              id: '16',
              navn: '§ 10-7c Grunnmønster',
            },
            {
              id: '17',
              navn: '§ 10-7d Førerhund',
            },
            {
              id: '18',
              navn: '§ 10-7e Lese- og sekretærhjelp',
            },
            {
              id: '19',
              navn: '§ 10-7f Tolkehjelp',
            },
            {
              id: '20',
              navn: '§ 10-7g Tolk- og ledsagerhjelp',
            },
            {
              id: 'FTRL_10_7I_B',
              navn: '§ 10-7i HMS',
            },
            {
              id: '23',
              navn: '§ 10-7 Ombygging av maskiner',
            },
            {
              id: '24',
              navn: '§ 10-7 Opplæringstiltak',
            },
            {
              id: '25',
              navn: '§ 10-8 Bortfall av rettigheter',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
          ],
        },
        {
          lovkilde: {
            id: '2',
            navn: 'Forskrift om aktivitetshjelpemidler til de over 26 år',
            beskrivelse: 'Forskrift om aktivitetshjelpemidler til de over 26 år',
          },
          registreringshjemler: [
            {
              id: '32',
              navn: '§ 2 aktivitetshjelpemidler',
            },
            {
              id: 'FS_AKT_26_3A',
              navn: '§ 2 Utlån',
            },
            {
              id: '35',
              navn: '§ 4 egenandel',
            },
            {
              id: '36',
              navn: '§ 5 spesialtilpasning av ordinært utstyr',
            },
          ],
        },
        {
          lovkilde: {
            id: '3',
            navn: 'Forskrift om hjelpemidler mm.',
            beskrivelse: 'Forskrift om stønad til hjelpemidler mv.',
          },
          registreringshjemler: [
            {
              id: '50',
              navn: '§ 2 alarm og varsling',
            },
            {
              id: '41',
              navn: '§ 2 behandlingsbriller til barn',
            },
            {
              id: '44',
              navn: '§ 2 boligtilskudd',
            },
            {
              id: '40',
              navn: '§ 2 briller og linser',
            },
            {
              id: '38',
              navn: '§ 2 datautstyr',
            },
            {
              id: '49',
              navn: '§ 2 gjeldsoppgjør',
            },
            {
              id: '46',
              navn: '§ 2 gå- og forflytningshjelpemidler',
            },
            {
              id: '45',
              navn: '§ 2 heisløsninger',
            },
            {
              id: '42',
              navn: '§ 2 hørselshjelpemidler',
            },
            {
              id: '43',
              navn: '§ 2 kommunikasjon (ASK)',
            },
            {
              id: '51',
              navn: '§ 2 madrasser og puter',
            },
            {
              id: '48',
              navn: '§ 2 møbler',
            },
            {
              id: '54',
              navn: '§ 2 refusjon isteden for utlån',
            },
            {
              id: '47',
              navn: '§ 2 småhjelpemidler',
            },
            {
              id: '39',
              navn: '§ 2 synshjelpemidler',
            },
            {
              id: '37',
              navn: '§ 2 trening, aktivisering, stimulering og lek',
            },
            {
              id: '52',
              navn: '§ 2 utstyr på arbeidsplass jordbruk og fiske',
            },
            {
              id: '53',
              navn: '§ 2 varmehjelpemidler',
            },
            {
              id: 'FS_HJE_MM_3A',
              navn: '§ 3 grunnmønster',
            },
            {
              id: 'FS_HJE_MM_4',
              navn: '§ 4 førerhund',
            },
            {
              id: 'FS_HJE_MM_6D',
              navn: '§ 6 folkehøgskole',
            },
            {
              id: '55',
              navn: '§ 6 tilpasningskurs',
            },
            {
              id: '58',
              navn: '§ 7 reise',
            },
          ],
        },
        {
          lovkilde: {
            id: '5',
            navn: 'Forskrift om høreapparater mm.',
            beskrivelse: 'Forskrift om stønad til høreapparat og tinnitusmaskerer',
          },
          registreringshjemler: [
            {
              id: '80',
              navn: '§ 2 høreapparat',
            },
            {
              id: '86',
              navn: '§ 3 gjenanskaffelse',
            },
            {
              id: '91',
              navn: '§ 4 krav til søknad og produkt',
            },
            {
              id: 'FS_HA_MM_6A',
              navn: '§ 6 Pris og leveringsavtaler',
            },
            {
              id: '92',
              navn: '§ 8 stønad og satser',
            },
          ],
        },
        {
          lovkilde: {
            id: '6',
            navn: 'Forskrift om servicehund',
            beskrivelse: 'Forskrift om stønad til servicehund',
          },
          registreringshjemler: [
            {
              id: '93',
              navn: '§ 2 servicehund',
            },
          ],
        },
        {
          lovkilde: {
            id: '71',
            navn: 'Forskrift om stønad til briller til barn',
            beskrivelse: 'Forskrift om stønad til briller til barn',
          },
          registreringshjemler: [
            {
              id: 'FS_STØNAD_BRILLER_TIL_BARN_2',
              navn: '§ 2 Vilkår for rett til stønad',
            },
            {
              id: 'FS_STØNAD_BRILLER_TIL_BARN_3',
              navn: '§ 3 Antall briller',
            },
            {
              id: 'FS_STØNAD_BRILLER_TIL_BARN_4',
              navn: '§ 4 Stønadens størrelse',
            },
            {
              id: 'FS_STØNAD_BRILLER_TIL_BARN_6',
              navn: '§ 6 Fremsetting av krav',
            },
            {
              id: 'FS_STØNAD_BRILLER_TIL_BARN_7',
              navn: '§ 7 Krav til dokumentasjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: 'EOES_883_2004_23',
              navn: 'art. 23',
            },
            {
              id: 'EOES_883_2004_24',
              navn: 'art. 24',
            },
            {
              id: 'EOES_883_2004_25',
              navn: 'art. 25',
            },
            {
              id: 'EOES_883_2004_33',
              navn: 'art. 33',
            },
            {
              id: 'EOES_883_2004_81',
              navn: 'art. 81',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4701',
          navn: 'Nav Hjelpemiddelsentral Øst-Viken',
        },
        {
          id: '4702',
          navn: 'Nav Hjelpemiddelsentral Akershus',
        },
        {
          id: '4703',
          navn: 'Nav Hjelpemiddelsentral Oslo',
        },
        {
          id: '4704',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Elverum',
        },
        {
          id: '4705',
          navn: 'Nav Hjelpemiddelsentral Innlandet-Gjøvik',
        },
        {
          id: '4706',
          navn: 'Nav Hjelpemiddelsentral Vest-Viken',
        },
        {
          id: '4707',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Sandefjord',
        },
        {
          id: '4708',
          navn: 'Nav Hjelpemiddelsentral Vestfold og Telemark-Skien',
        },
        {
          id: '4709',
          navn: 'Nav Hjelpemiddelsentral Agder-Arendal',
        },
        {
          id: '4710',
          navn: 'Nav Hjelpemiddelsentral Agder',
        },
        {
          id: '4711',
          navn: 'Nav Hjelpemiddelsentral Rogaland',
        },
        {
          id: '4712',
          navn: 'Nav Hjelpemiddelsentral Vestland-Bergen',
        },
        {
          id: '4714',
          navn: 'Nav Hjelpemiddelsentral Vestland-Førde',
        },
        {
          id: '4715',
          navn: 'Nav Hjelpemiddelsentral Møre og Romsdal',
        },
        {
          id: '4716',
          navn: 'Nav Hjelpemiddelsentral Trøndelag',
        },
        {
          id: '4717',
          navn: 'Nav Hjelpemiddelsentral Nord-Trøndelag',
        },
        {
          id: '4718',
          navn: 'Nav Hjelpemiddelsentral Nordland',
        },
        {
          id: '4719',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Tromsø',
        },
        {
          id: '4720',
          navn: 'Nav Hjelpemiddelsentral Troms og Finnmark-Lakselv',
        },
        {
          id: '4408',
          navn: 'Nav Arbeid og ytelser Skien',
        },
        {
          id: '4418',
          navn: 'Nav Arbeid og ytelser Fauske',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_10_3',
          navn: 'Ftrl - § 10-3',
          beskrivelse: 'Folketrygdloven - § 10-3',
        },
        {
          id: 'FTRL_10_4',
          navn: 'Ftrl - § 10-4',
          beskrivelse: 'Folketrygdloven - § 10-4',
        },
        {
          id: 'FTRL_10_5',
          navn: 'Ftrl - § 10-5 Arbeid',
          beskrivelse: 'Folketrygdloven - § 10-5 Arbeid',
        },
        {
          id: 'FTRL_10_6',
          navn: 'Ftrl - § 10-6 Dagligliv',
          beskrivelse: 'Folketrygdloven - § 10-6 Dagligliv',
        },
        {
          id: 'FTRL_10_7A',
          navn: 'Ftrl - § 10-7a',
          beskrivelse: 'Folketrygdloven - § 10-7a',
        },
        {
          id: 'FTRL_10_7B',
          navn: 'Ftrl - § 10-7b Høreapparat',
          beskrivelse: 'Folketrygdloven - § 10-7b Høreapparat',
        },
        {
          id: 'FTRL_10_7C',
          navn: 'Ftrl - § 10-7c Grunnmønster',
          beskrivelse: 'Folketrygdloven - § 10-7c Grunnmønster',
        },
        {
          id: 'FTRL_10_7D',
          navn: 'Ftrl - § 10-7d Førerhund',
          beskrivelse: 'Folketrygdloven - § 10-7d Førerhund',
        },
        {
          id: 'FTRL_10_7E',
          navn: 'Ftrl - § 10-7e Lese- og sekretærhjelp',
          beskrivelse: 'Folketrygdloven - § 10-7e Lese- og sekretærhjelp',
        },
        {
          id: 'FTRL_10_7F',
          navn: 'Ftrl - § 10-7f Tolkehjelp',
          beskrivelse: 'Folketrygdloven - § 10-7f Tolkehjelp',
        },
        {
          id: 'FTRL_10_7G',
          navn: 'Ftrl - § 10-7g Tolk- og ledsagerhjelp',
          beskrivelse: 'Folketrygdloven - § 10-7g Tolk- og ledsagerhjelp',
        },
        {
          id: 'FTRL_10_7I_B',
          navn: 'Ftrl - § 10-7i HMS',
          beskrivelse: 'Folketrygdloven - § 10-7i HMS',
        },
        {
          id: 'FTRL_10_7XA',
          navn: 'Ftrl - § 10-7 Ombygging av maskiner',
          beskrivelse: 'Folketrygdloven - § 10-7 Ombygging av maskiner',
        },
        {
          id: 'FTRL_10_7XB',
          navn: 'Ftrl - § 10-7 Opplæringstiltak',
          beskrivelse: 'Folketrygdloven - § 10-7 Opplæringstiltak',
        },
        {
          id: 'FTRL_10_8',
          navn: 'Ftrl - § 10-8 Bortfall av rettigheter',
          beskrivelse: 'Folketrygdloven - § 10-8 Bortfall av rettigheter',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_8',
          navn: 'Ftrl - § 21-8',
          beskrivelse: 'Folketrygdloven - § 21-8',
        },
        {
          id: 'FTRL_21_10',
          navn: 'Ftrl - § 21-10',
          beskrivelse: 'Folketrygdloven - § 21-10',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.012',
          navn: 'Ftrl - § 22-12',
          beskrivelse: 'Folketrygdloven - § 22-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: 'FTRL_22_14',
          navn: 'Ftrl - § 22-14',
          beskrivelse: 'Folketrygdloven - § 22-14',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FS_AKT_26_2A',
          navn: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 2 aktivitetshjelpemidler',
          beskrivelse: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 2 aktivitetshjelpemidler',
        },
        {
          id: 'FS_AKT_26_2B',
          navn: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 2 Utlån',
          beskrivelse: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 2 Utlån',
        },
        {
          id: 'FS_AKT_26_4',
          navn: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 4 egenandel',
          beskrivelse: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 4 egenandel',
        },
        {
          id: 'FS_AKT_26_5',
          navn: 'Forskrift om aktivitetshjelpemidler til de over 26 år - § 5 spesialtilpasning av ordinært utstyr',
          beskrivelse:
            'Forskrift om aktivitetshjelpemidler til de over 26 år - § 5 spesialtilpasning av ordinært utstyr',
        },
        {
          id: 'FS_HJE_MM_2A',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 trening, aktivisering, stimulering og lek',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 trening, aktivisering, stimulering og lek',
        },
        {
          id: 'FS_HJE_MM_2B',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 datautstyr',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 datautstyr',
        },
        {
          id: 'FS_HJE_MM_2C',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 synshjelpemidler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 synshjelpemidler',
        },
        {
          id: 'FS_HJE_MM_2D',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 briller og linser',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 briller og linser',
        },
        {
          id: 'FS_HJE_MM_2E',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 behandlingsbriller til barn',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 behandlingsbriller til barn',
        },
        {
          id: 'FS_HJE_MM_2F',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 hørselshjelpemidler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 hørselshjelpemidler',
        },
        {
          id: 'FS_HJE_MM_2G',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 kommunikasjon (ASK)',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 kommunikasjon (ASK)',
        },
        {
          id: 'FS_HJE_MM_2H',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 boligtilskudd',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 boligtilskudd',
        },
        {
          id: 'FS_HJE_MM_2I',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 heisløsninger',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 heisløsninger',
        },
        {
          id: 'FS_HJE_MM_2J',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 gå- og forflytningshjelpemidler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 gå- og forflytningshjelpemidler',
        },
        {
          id: 'FS_HJE_MM_2K',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 småhjelpemidler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 småhjelpemidler',
        },
        {
          id: 'FS_HJE_MM_2L',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 møbler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 møbler',
        },
        {
          id: 'FS_HJE_MM_2M',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 gjeldsoppgjør',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 gjeldsoppgjør',
        },
        {
          id: 'FS_HJE_MM_2N',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 alarm og varsling',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 alarm og varsling',
        },
        {
          id: 'FS_HJE_MM_2O',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 madrasser og puter',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 madrasser og puter',
        },
        {
          id: 'FS_HJE_MM_2P',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 utstyr på arbeidsplass jordbruk og fiske',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 utstyr på arbeidsplass jordbruk og fiske',
        },
        {
          id: 'FS_HJE_MM_2Q',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 varmehjelpemidler',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 varmehjelpemidler',
        },
        {
          id: 'FS_HJE_MM_2R',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 2 refusjon isteden for utlån',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 2 refusjon isteden for utlån',
        },
        {
          id: 'FS_HJE_MM_4',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 4 førerhund',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 4 førerhund',
        },
        {
          id: 'FS_HJE_MM_6A',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 6 tilpasningskurs',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 6 tilpasningskurs',
        },
        {
          id: 'FS_HJE_MM_6D',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 6 folkehøgskole',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 6 folkehøgskole',
        },
        {
          id: 'FS_HJE_MM_7',
          navn: 'Forskrift om stønad til hjelpemidler mv. - § 7 reise',
          beskrivelse: 'Forskrift om hjelpemidler mm. - § 7 reise',
        },
        {
          id: 'FS_HA_MM_2A',
          navn: 'Forskrift om stønad til høreapparat og tinnitusmaskerer - § 2 høreapparat',
          beskrivelse: 'Forskrift om høreapparater mm. - § 2 høreapparat',
        },
        {
          id: 'FS_HA_MM_3A',
          navn: 'Forskrift om stønad til høreapparat og tinnitusmaskerer - § 3 gjenanskaffelse',
          beskrivelse: 'Forskrift om høreapparater mm. - § 3 gjenanskaffelse',
        },
        {
          id: 'FS_HA_MM_4A',
          navn: 'Forskrift om stønad til høreapparat og tinnitusmaskerer - § 4 krav til søknad og produkt',
          beskrivelse: 'Forskrift om høreapparater mm. - § 4 krav til søknad og produkt',
        },
        {
          id: 'FS_HA_MM_6A',
          navn: 'Forskrift om stønad til høreapparat og tinnitusmaskerer - § 6 Pris og leveringsavtaler',
          beskrivelse: 'Forskrift om høreapparater mm. - § 6 Pris og leveringsavtaler',
        },
        {
          id: 'FS_HA_MM_8A',
          navn: 'Forskrift om stønad til høreapparat og tinnitusmaskerer - § 8 stønad og satser',
          beskrivelse: 'Forskrift om høreapparater mm. - § 8 stønad og satser',
        },
        {
          id: 'FS_SH_2',
          navn: 'Forskrift om stønad til servicehund - § 2 servicehund',
          beskrivelse: 'Forskrift om servicehund - § 2 servicehund',
        },
        {
          id: 'EOES_883_2004_11',
          navn: 'EØS forordning 883/2004 - art. 11',
          beskrivelse: 'EØS forordning 883/2004 - art. 11',
        },
        {
          id: 'EOES_883_2004_12',
          navn: 'EØS forordning 883/2004 - art. 12',
          beskrivelse: 'EØS forordning 883/2004 - art. 12',
        },
        {
          id: 'EOES_883_2004_13',
          navn: 'EØS forordning 883/2004 - art. 13',
          beskrivelse: 'EØS forordning 883/2004 - art. 13',
        },
        {
          id: 'EOES_883_2004_23',
          navn: 'EØS forordning 883/2004 - art. 23',
          beskrivelse: 'EØS forordning 883/2004 - art. 23',
        },
        {
          id: 'EOES_883_2004_24',
          navn: 'EØS forordning 883/2004 - art. 24',
          beskrivelse: 'EØS forordning 883/2004 - art. 24',
        },
        {
          id: 'EOES_883_2004_25',
          navn: 'EØS forordning 883/2004 - art. 25',
          beskrivelse: 'EØS forordning 883/2004 - art. 25',
        },
        {
          id: 'EOES_883_2004_33',
          navn: 'EØS forordning 883/2004 - art. 33',
          beskrivelse: 'EØS forordning 883/2004 - art. 33',
        },
        {
          id: 'EOES_883_2004_81',
          navn: 'EØS forordning 883/2004 - art. 81',
          beskrivelse: 'EØS forordning 883/2004 - art. 81',
        },
        {
          id: 'GJ_F_FORD_987_2009_11',
          navn: 'Gjennomføringsforordning 987/2009 - art. 11',
          beskrivelse: 'Gjennomføringsforordning 987/2009 - art. 11',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
        {
          id: 'FVL_11',
          navn: 'Fvl - § 11',
          beskrivelse: 'Forvaltningsloven - § 11',
        },
        {
          id: 'FVL_12',
          navn: 'Fvl - § 12',
          beskrivelse: 'Forvaltningsloven - § 12',
        },
        {
          id: 'FVL_14',
          navn: 'Fvl - § 14',
          beskrivelse: 'Forvaltningsloven - § 14',
        },
        {
          id: 'FVL_16',
          navn: 'Fvl - § 16',
          beskrivelse: 'Forvaltningsloven - § 16',
        },
        {
          id: 'FVL_17',
          navn: 'Fvl - § 17',
          beskrivelse: 'Forvaltningsloven - § 17',
        },
        {
          id: 'FVL_18_19',
          navn: 'Fvl - §§ 18 og 19',
          beskrivelse: 'Forvaltningsloven - §§ 18 og 19',
        },
        {
          id: 'FVL_21',
          navn: 'Fvl - § 21',
          beskrivelse: 'Forvaltningsloven - § 21',
        },
        {
          id: 'FVL_24',
          navn: 'Fvl - § 24',
          beskrivelse: 'Forvaltningsloven - § 24',
        },
        {
          id: 'FVL_25',
          navn: 'Fvl - § 25',
          beskrivelse: 'Forvaltningsloven - § 25',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_41',
          navn: 'Fvl - § 41',
          beskrivelse: 'Forvaltningsloven - § 41',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
        {
          id: 'TRRL_2',
          navn: 'Trrl - § 2',
          beskrivelse: 'Trygderettsloven - § 2',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
        {
          id: 'TRRL_12',
          navn: 'Trrl - § 12',
          beskrivelse: 'Trygderettsloven - § 12',
        },
        {
          id: 'TRRL_14',
          navn: 'Trrl - § 14',
          beskrivelse: 'Trygderettsloven - § 14',
        },
      ],
    },
    {
      id: '43',
      navn: 'Kompensasjonsytelse for selvstendig næringsdrivende og frilansere',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '48',
            navn: 'Midlertidig lov om kompensasjonsytelse for selvstendig næringsdrivende og frilansere',
            beskrivelse: 'Midlertidig lov om kompensasjonsytelse for selvstendig næringsdrivende og frilansere',
          },
          registreringshjemler: [
            {
              id: '772',
              navn: '§ 2',
            },
            {
              id: '773',
              navn: '§ 3',
            },
            {
              id: '774',
              navn: '§ 4',
            },
            {
              id: '775',
              navn: '§ 7',
            },
            {
              id: '776',
              navn: '§ 9',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4863',
          navn: 'Nav Familie- og pensjonsytelser midlertidig enhet',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '23',
      navn: 'Kontantstøtte',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '31',
            navn: 'Kontantstøtteloven',
            beskrivelse: 'Kontantstøtteloven',
          },
          registreringshjemler: [
            {
              id: 'KONTSL_1A',
              navn: '§ 1a',
            },
            {
              id: '606',
              navn: '§ 2',
            },
            {
              id: '621',
              navn: '§ 3',
            },
            {
              id: 'KONTSL_3A',
              navn: '§ 3a',
            },
            {
              id: '608',
              navn: '§ 4',
            },
            {
              id: '609',
              navn: '§ 6',
            },
            {
              id: '610',
              navn: '§ 7',
            },
            {
              id: '611',
              navn: '§ 8',
            },
            {
              id: '612',
              navn: '§ 9',
            },
            {
              id: '613',
              navn: '§ 10',
            },
            {
              id: '614',
              navn: '§ 11',
            },
            {
              id: '615',
              navn: '§ 12',
            },
            {
              id: '616',
              navn: '§ 13',
            },
            {
              id: '617',
              navn: '§ 14',
            },
            {
              id: '618',
              navn: '§ 16',
            },
            {
              id: 'KONTSL_17',
              navn: '§ 17',
            },
            {
              id: 'KONTSL_19',
              navn: '§ 19',
            },
            {
              id: 'KONTSL_22',
              navn: '§ 22',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '604',
              navn: 'art. 16',
            },
            {
              id: '605',
              navn: 'art. 67',
            },
            {
              id: '620',
              navn: 'art. 68',
            },
          ],
        },
        {
          lovkilde: {
            id: '30',
            navn: 'EØS-avtalen',
            beskrivelse: 'EØS-avtalen',
          },
          registreringshjemler: [
            {
              id: '601',
              navn: 'EØS-avtalen',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: '538',
              navn: 'art. 11',
            },
            {
              id: '663',
              navn: 'art. 59',
            },
            {
              id: '664',
              navn: 'art. 60',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: 'FVL_36',
              navn: '§ 36',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4812',
          navn: 'Nav Familie- og pensjonsytelser Bergen',
        },
        {
          id: '4820',
          navn: 'Nav Familie- og pensjonsytelser Vadsø',
        },
        {
          id: '4806',
          navn: 'Nav Familie- og pensjonsytelser Drammen',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '4842',
          navn: 'Nav Familie- og pensjonsytelser Stord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'KONTSL_1A',
          navn: 'Kontantstøtteloven - § 1a',
          beskrivelse: 'Kontantstøtteloven - § 1a',
        },
        {
          id: '606',
          navn: 'Kontantstøtteloven - § 2',
          beskrivelse: 'Kontantstøtteloven - § 2',
        },
        {
          id: '621',
          navn: 'Kontantstøtteloven - § 3',
          beskrivelse: 'Kontantstøtteloven - § 3',
        },
        {
          id: 'KONTSL_3A',
          navn: 'Kontantstøtteloven - § 3a',
          beskrivelse: 'Kontantstøtteloven - § 3a',
        },
        {
          id: 'KONTSL_4',
          navn: 'Kontantstøtteloven - § 4',
          beskrivelse: 'Kontantstøtteloven - § 4',
        },
        {
          id: '609',
          navn: 'Kontantstøtteloven - § 6',
          beskrivelse: 'Kontantstøtteloven - § 6',
        },
        {
          id: '610',
          navn: 'Kontantstøtteloven - § 7',
          beskrivelse: 'Kontantstøtteloven - § 7',
        },
        {
          id: '611',
          navn: 'Kontantstøtteloven - § 8',
          beskrivelse: 'Kontantstøtteloven - § 8',
        },
        {
          id: '612',
          navn: 'Kontantstøtteloven - § 9',
          beskrivelse: 'Kontantstøtteloven - § 9',
        },
        {
          id: '613',
          navn: 'Kontantstøtteloven - § 10',
          beskrivelse: 'Kontantstøtteloven - § 10',
        },
        {
          id: '614',
          navn: 'Kontantstøtteloven - § 11',
          beskrivelse: 'Kontantstøtteloven - § 11',
        },
        {
          id: '615',
          navn: 'Kontantstøtteloven - § 12',
          beskrivelse: 'Kontantstøtteloven - § 12',
        },
        {
          id: '616',
          navn: 'Kontantstøtteloven - § 13',
          beskrivelse: 'Kontantstøtteloven - § 13',
        },
        {
          id: 'KONTSL_14',
          navn: 'Kontantstøtteloven - § 14',
          beskrivelse: 'Kontantstøtteloven - § 14',
        },
        {
          id: '618',
          navn: 'Kontantstøtteloven - § 16',
          beskrivelse: 'Kontantstøtteloven - § 16',
        },
        {
          id: 'KONTSL_17',
          navn: 'Kontantstøtteloven - § 17',
          beskrivelse: 'Kontantstøtteloven - § 17',
        },
        {
          id: 'KONTSL_19',
          navn: 'Kontantstøtteloven - § 19',
          beskrivelse: 'Kontantstøtteloven - § 19',
        },
        {
          id: 'KONTSL_22',
          navn: 'Kontantstøtteloven - § 22',
          beskrivelse: 'Kontantstøtteloven - § 22',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FVL_28',
          navn: 'Fvl - § 28',
          beskrivelse: 'Forvaltningsloven - § 28',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_32',
          navn: 'Fvl - § 32',
          beskrivelse: 'Forvaltningsloven - § 32',
        },
        {
          id: 'FVL_33',
          navn: 'Fvl - § 33',
          beskrivelse: 'Forvaltningsloven - § 33',
        },
        {
          id: 'FVL_34',
          navn: 'Fvl - § 34',
          beskrivelse: 'Forvaltningsloven - § 34',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_36',
          navn: 'Fvl - § 36',
          beskrivelse: 'Forvaltningsloven - § 36',
        },
        {
          id: '601',
          navn: 'EØS-avtalen - EØS-avtalen',
          beskrivelse: 'EØS-avtalen - EØS-avtalen',
        },
        {
          id: 'NORDISK_KONVENSJON',
          navn: 'Nordisk konvensjon - Nordisk konvensjon',
          beskrivelse: 'Nordisk konvensjon - Nordisk konvensjon',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
      ],
    },
    {
      id: '29',
      navn: 'Krigspensjon',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '25',
            navn: 'Lov om krigspensjon for militærpersoner',
            beskrivelse: 'Lov om krigspensjon for militærpersoner',
          },
          registreringshjemler: [
            {
              id: '582',
              navn: 'Lov om krigspensjon for militærpersoner',
            },
          ],
        },
        {
          lovkilde: {
            id: '26',
            navn: 'Lov om krigspensjon for sivile m.v',
            beskrivelse: 'Lov om krigspensjonering for sivile m.v.',
          },
          registreringshjemler: [
            {
              id: '583',
              navn: 'Lov om krigspensjon for sivile m.v',
            },
          ],
        },
        {
          lovkilde: {
            id: '27',
            navn: 'Tilleggslov om krigspensjonering av 1951',
            beskrivelse: 'Tilleggslov om krigspensjonering av 1951',
          },
          registreringshjemler: [
            {
              id: '584',
              navn: 'Tilleggslov om krigspensjonering av 1951',
            },
          ],
        },
        {
          lovkilde: {
            id: '28',
            navn: 'Tilleggslov om krigspensjonering av 1968',
            beskrivelse: 'Tilleggslov om krigspensjonering av 1968',
          },
          registreringshjemler: [
            {
              id: '585',
              navn: 'Tilleggslov om krigspensjonering av 1968',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '18',
      navn: 'Lønnsgaranti',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '42',
            navn: 'Lønnsgarantiloven',
            beskrivelse: 'Lønnsgarantiloven',
          },
          registreringshjemler: [
            {
              id: '737',
              navn: '§ 1 (2) og 1 (6)',
            },
            {
              id: '738',
              navn: '§ 1 (3) nr.3',
            },
            {
              id: '739',
              navn: '§ 1 (3) og (4)',
            },
            {
              id: '736',
              navn: '§ 1 jf 3-2 nr.4',
            },
            {
              id: '740',
              navn: '§ 1 jf deknl. § 9-3',
            },
            {
              id: '741',
              navn: '§ 6',
            },
            {
              id: '742',
              navn: '§ 7 (1)',
            },
            {
              id: '743',
              navn: '§ 7 (2)',
            },
            {
              id: '744',
              navn: '§ 10 jf Lgf. 3-4',
            },
          ],
        },
        {
          lovkilde: {
            id: '59',
            navn: 'Dekningsloven',
            beskrivelse: 'Deknl',
          },
          registreringshjemler: [
            {
              id: '863',
              navn: '§ 7-11',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4401',
          navn: 'Nav Arbeid og ytelser Sarpsborg',
        },
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4426',
          navn: 'Nav Arbeid og ytelser lønnsgaranti Vardø',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '47',
      navn: 'Lønnskompensasjon for permitterte',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '49',
            navn: 'Lønnskompensasjon for permitterte',
            beskrivelse: 'Lønnskompensasjon for permitterte',
          },
          registreringshjemler: [
            {
              id: '777',
              navn: '§ 3',
            },
            {
              id: '778',
              navn: '§ 4',
            },
            {
              id: '779',
              navn: '§ 5',
            },
            {
              id: '780',
              navn: '§ 6',
            },
            {
              id: '781',
              navn: '§ 8',
            },
            {
              id: '782',
              navn: '§ 9',
            },
            {
              id: '783',
              navn: '§ 10',
            },
            {
              id: '784',
              navn: '§ 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4486',
          navn: 'Nav Arbeid og ytelse lønnskompensasjon',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '24',
      navn: 'Medlemskap',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '416',
              navn: '§ 2-3',
            },
            {
              id: '417',
              navn: '§ 2-4',
            },
            {
              id: '418',
              navn: '§ 2-5',
            },
            {
              id: '745',
              navn: '§ 2-6',
            },
            {
              id: '419',
              navn: '§ 2-7',
            },
            {
              id: '420',
              navn: '§ 2-8',
            },
            {
              id: '421',
              navn: '§ 2-9',
            },
            {
              id: '422',
              navn: '§ 2-10',
            },
            {
              id: '423',
              navn: '§ 2-11',
            },
            {
              id: '424',
              navn: '§ 2-12',
            },
            {
              id: '425',
              navn: '§ 2-13',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '426',
              navn: '§ 2-15',
            },
            {
              id: '427',
              navn: '§ 2-16',
            },
            {
              id: '428',
              navn: '§ 2-17',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '827',
              navn: '§ 23-3',
            },
            {
              id: '828',
              navn: '§ 23-4',
            },
            {
              id: '829',
              navn: '§ 24-1',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '602',
              navn: 'art. 14',
            },
            {
              id: '604',
              navn: 'art. 16',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '58',
            navn: 'Hovednummer 42 - Trygdeavtaler',
            beskrivelse: 'Hnr. 42',
          },
          registreringshjemler: [
            {
              id: '862',
              navn: 'Resterende avtaler',
            },
            {
              id: '861',
              navn: 'Storbritannia og Nord-Irland',
            },
            {
              id: '859',
              navn: 'Tyrkia',
            },
            {
              id: '860',
              navn: 'USA',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4525',
          navn: 'Nav Kontroll Forvaltning',
        },
        {
          id: '4530',
          navn: 'Nav Medlemskap og avgift',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_2_1',
          navn: 'Ftrl - § 2-1',
          beskrivelse: 'Folketrygdloven - § 2-1',
        },
        {
          id: 'FTRL_2_2',
          navn: 'Ftrl - § 2-2',
          beskrivelse: 'Folketrygdloven - § 2-2',
        },
        {
          id: 'FTRL_2_3',
          navn: 'Ftrl - § 2-3',
          beskrivelse: 'Folketrygdloven - § 2-3',
        },
        {
          id: 'FTRL_2_4',
          navn: 'Ftrl - § 2-4',
          beskrivelse: 'Folketrygdloven - § 2-4',
        },
        {
          id: 'FTRL_2_5',
          navn: 'Ftrl - § 2-5',
          beskrivelse: 'Folketrygdloven - § 2-5',
        },
        {
          id: 'FTRL_2_6',
          navn: 'Ftrl - § 2-6',
          beskrivelse: 'Folketrygdloven - § 2-6',
        },
        {
          id: 'FTRL_2_7',
          navn: 'Ftrl - § 2-7',
          beskrivelse: 'Folketrygdloven - § 2-7',
        },
        {
          id: 'FTRL_2_8',
          navn: 'Ftrl - § 2-8',
          beskrivelse: 'Folketrygdloven - § 2-8',
        },
        {
          id: 'FTRL_2_11',
          navn: 'Ftrl - § 2-11',
          beskrivelse: 'Folketrygdloven - § 2-11',
        },
        {
          id: 'FTRL_2_12',
          navn: 'Ftrl - § 2-12',
          beskrivelse: 'Folketrygdloven - § 2-12',
        },
        {
          id: 'FTRL_2_13',
          navn: 'Ftrl - § 2-13',
          beskrivelse: 'Folketrygdloven - § 2-13',
        },
        {
          id: 'FTRL_2_14',
          navn: 'Ftrl - § 2-14',
          beskrivelse: 'Folketrygdloven - § 2-14',
        },
        {
          id: 'FTRL_2_15',
          navn: 'Ftrl - § 2-15',
          beskrivelse: 'Folketrygdloven - § 2-15',
        },
        {
          id: 'FTRL_2_17',
          navn: 'Ftrl - § 2-17',
          beskrivelse: 'Folketrygdloven - § 2-17',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FTRL_23_3',
          navn: 'Ftrl - § 23-3',
          beskrivelse: 'Folketrygdloven - § 23-3',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'EOES_883_2004',
          navn: 'EØS forordning 883/2004 - EØS forordning 883/2004',
          beskrivelse: 'EØS forordning 883/2004 - EØS forordning 883/2004',
        },
        {
          id: 'ANDRE_TRYGDEAVTALER',
          navn: 'Andre trygdeavtaler - Andre trygdeavtaler',
          beskrivelse: 'Andre trygdeavtaler - Andre trygdeavtaler',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '40',
      navn: 'Oppfølgingssak - NAV-loven §14a',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '47',
            navn: 'NAV-loven',
            beskrivelse: 'NAV-loven',
          },
          registreringshjemler: [
            {
              id: '771',
              navn: '§ 14a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '0101',
          navn: 'Nav Halden-Aremark',
        },
        {
          id: '0104',
          navn: 'Nav Moss',
        },
        {
          id: '0105',
          navn: 'Nav Sarpsborg',
        },
        {
          id: '0106',
          navn: 'Nav Fredrikstad',
        },
        {
          id: '0111',
          navn: 'Nav Hvaler',
        },
        {
          id: '0119',
          navn: 'Nav Skiptvet Marker',
        },
        {
          id: '0124',
          navn: 'Nav Indre Østfold',
        },
        {
          id: '0127',
          navn: 'Nav Skiptvet',
        },
        {
          id: '0128',
          navn: 'Nav Rakkestad',
        },
        {
          id: '0135',
          navn: 'Nav Råde',
        },
        {
          id: '0137',
          navn: 'Nav Våler i Viken',
        },
        {
          id: '1037',
          navn: 'Nav Lister',
        },
        {
          id: '0211',
          navn: 'Nav Vestby',
        },
        {
          id: '0213',
          navn: 'Nav Nordre Follo',
        },
        {
          id: '0214',
          navn: 'Nav Ås',
        },
        {
          id: '0215',
          navn: 'Nav Frogn',
        },
        {
          id: '0219',
          navn: 'Nav Bærum',
        },
        {
          id: '0220',
          navn: 'Nav Asker',
        },
        {
          id: '0221',
          navn: 'Nav Aurskog-Høland',
        },
        {
          id: '0228',
          navn: 'Nav Rælingen',
        },
        {
          id: '0229',
          navn: 'Nav Enebakk',
        },
        {
          id: '0230',
          navn: 'Nav Lørenskog',
        },
        {
          id: '0231',
          navn: 'Nav Lillestrøm',
        },
        {
          id: '0233',
          navn: 'Nav Nittedal',
        },
        {
          id: '0234',
          navn: 'Nav Gjerdrum',
        },
        {
          id: '0235',
          navn: 'Nav Ullensaker',
        },
        {
          id: '0236',
          navn: 'Nav Nes i Akershus',
        },
        {
          id: '0237',
          navn: 'Nav Eidsvoll',
        },
        {
          id: '0238',
          navn: 'Nav Nannestad Gjerdrum',
        },
        {
          id: '0239',
          navn: 'Nav Hurdal',
        },
        {
          id: '0283',
          navn: 'Nav egne ansatte Øst-Viken',
        },
        {
          id: '0312',
          navn: 'Nav Frogner',
        },
        {
          id: '0313',
          navn: 'Nav St. Hanshaugen',
        },
        {
          id: '0314',
          navn: 'Nav Sagene',
        },
        {
          id: '0315',
          navn: 'Nav Grünerløkka',
        },
        {
          id: '0316',
          navn: 'Nav Gamle Oslo',
        },
        {
          id: '0318',
          navn: 'Nav Nordstrand',
        },
        {
          id: '0319',
          navn: 'Nav Søndre Nordstrand',
        },
        {
          id: '0321',
          navn: 'Nav Østensjø',
        },
        {
          id: '0326',
          navn: 'Nav Alna',
        },
        {
          id: '0327',
          navn: 'Nav Stovner',
        },
        {
          id: '0328',
          navn: 'Nav Grorud',
        },
        {
          id: '0330',
          navn: 'Nav Bjerke',
        },
        {
          id: '0331',
          navn: 'Nav Nordre Aker',
        },
        {
          id: '0334',
          navn: 'Nav Vestre Aker',
        },
        {
          id: '0383',
          navn: 'Nav egne ansatte Oslo',
        },
        {
          id: '0393',
          navn: 'Nav Utland og fellestjenester Oslo',
        },
        {
          id: '0402',
          navn: 'Nav Kongsvinger',
        },
        {
          id: '0403',
          navn: 'Nav Hamar',
        },
        {
          id: '0412',
          navn: 'Nav Ringsaker',
        },
        {
          id: '0415',
          navn: 'Nav Løten',
        },
        {
          id: '0417',
          navn: 'Nav Stange',
        },
        {
          id: '0418',
          navn: 'Nav Nord-Odal',
        },
        {
          id: '0420',
          navn: 'Nav Eidskog',
        },
        {
          id: '0423',
          navn: 'Nav Grue',
        },
        {
          id: '0425',
          navn: 'Nav Åsnes',
        },
        {
          id: '0426',
          navn: 'Nav Våler i Hedmark',
        },
        {
          id: '0427',
          navn: 'Nav Elverum',
        },
        {
          id: '0428',
          navn: 'Nav Trysil',
        },
        {
          id: '0429',
          navn: 'Nav Åmot',
        },
        {
          id: '0430',
          navn: 'Nav Stor-Elvdal',
        },
        {
          id: '0434',
          navn: 'Nav Engerdal',
        },
        {
          id: '0437',
          navn: 'Nav Nord-Østerdal',
        },
        {
          id: '0439',
          navn: 'Nav Folldal',
        },
        {
          id: '0450',
          navn: 'ENHET FOR ARBEIDSGIVER- OG ARBEIDSTAKERREGISTERET',
        },
        {
          id: '0476',
          navn: 'Nav Sykefraværssenter Hamarregionen',
        },
        {
          id: '0483',
          navn: 'Nav egne ansatte Innlandet',
        },
        {
          id: '0491',
          navn: 'Nav Arbeidslivssenter Innlandet',
        },
        {
          id: '0501',
          navn: 'Nav Lillehammer-Gausdal',
        },
        {
          id: '0502',
          navn: 'Nav Gjøvik',
        },
        {
          id: '0511',
          navn: 'Nav Lesja - Dovre',
        },
        {
          id: '0513',
          navn: 'Nav Lom-Skjåk',
        },
        {
          id: '0515',
          navn: 'Nav Vågå',
        },
        {
          id: '0516',
          navn: 'Nav Midt-Gudbrandsdal',
        },
        {
          id: '0517',
          navn: 'Nav Sel',
        },
        {
          id: '0519',
          navn: 'Nav Sør-Fron',
        },
        {
          id: '0521',
          navn: 'Nav Øyer',
        },
        {
          id: '0528',
          navn: 'Nav Østre Toten',
        },
        {
          id: '0529',
          navn: 'Nav Vestre Toten',
        },
        {
          id: '0532',
          navn: 'Nav Jevnaker',
        },
        {
          id: '0534',
          navn: 'Nav Hadeland',
        },
        {
          id: '0536',
          navn: 'Nav Søndre Land',
        },
        {
          id: '0538',
          navn: 'Nav Nordre Land',
        },
        {
          id: '0542',
          navn: 'Nav Valdres',
        },
        {
          id: '0600',
          navn: 'Nav Vest-Viken',
        },
        {
          id: '0602',
          navn: 'Nav Drammen',
        },
        {
          id: '0604',
          navn: 'Nav Kongsberg',
        },
        {
          id: '0605',
          navn: 'Nav Ringerike',
        },
        {
          id: '0612',
          navn: 'Nav Hole',
        },
        {
          id: '0617',
          navn: 'Nav Hallingdal',
        },
        {
          id: '0621',
          navn: 'Nav Sigdal',
        },
        {
          id: '0622',
          navn: 'Nav Krødsherad',
        },
        {
          id: '0623',
          navn: 'Nav Midt-Buskerud',
        },
        {
          id: '0624',
          navn: 'Nav Øvre Eiker',
        },
        {
          id: '0626',
          navn: 'Nav Lier',
        },
        {
          id: '0632',
          navn: 'Nav Numedal',
        },
        {
          id: '0683',
          navn: 'Nav egne ansatte Vest-Viken',
        },
        {
          id: '0701',
          navn: 'Nav Horten',
        },
        {
          id: '0704',
          navn: 'Nav Tønsberg',
        },
        {
          id: '0710',
          navn: 'Nav Sandefjord',
        },
        {
          id: '5301',
          navn: 'Nav Holmestrand',
        },
        {
          id: '5303',
          navn: 'Nav Larvik',
        },
        {
          id: '5302',
          navn: 'Nav Færder',
        },
        {
          id: '0805',
          navn: 'Nav Porsgrunn',
        },
        {
          id: '0806',
          navn: 'Nav Skien',
        },
        {
          id: '0811',
          navn: 'Nav Siljan',
        },
        {
          id: '0814',
          navn: 'Nav Bamble',
        },
        {
          id: '0815',
          navn: 'Nav Kragerø',
        },
        {
          id: '0817',
          navn: 'Nav Drangedal',
        },
        {
          id: '0821',
          navn: 'Nav Midt-Telemark',
        },
        {
          id: '0826',
          navn: 'Nav Tinn',
        },
        {
          id: '0833',
          navn: 'Nav Vest-Telemark',
        },
        {
          id: '0883',
          navn: 'Nav egne ansatte Vestfold og Telemark',
        },
        {
          id: '0904',
          navn: 'Nav Grimstad',
        },
        {
          id: '0906',
          navn: 'Nav Arendal',
        },
        {
          id: '0901',
          navn: 'Nav Risør',
        },
        {
          id: '0911',
          navn: 'Nav Gjerstad',
        },
        {
          id: '0914',
          navn: 'Nav Øst i Agder',
        },
        {
          id: '0919',
          navn: 'Nav Froland',
        },
        {
          id: '0928',
          navn: 'Nav Birkenes',
        },
        {
          id: '0929',
          navn: 'Nav Åmli',
        },
        {
          id: '0937',
          navn: 'Nav Evje og Hornnes',
        },
        {
          id: '0926',
          navn: 'Nav Lillesand',
        },
        {
          id: '1001',
          navn: 'Nav Kristiansand',
        },
        {
          id: '1002',
          navn: 'Nav Lindesnes',
        },
        {
          id: '1014',
          navn: 'Nav Midt-Agder',
        },
        {
          id: '1004',
          navn: 'Nav Flekkefjord',
        },
        {
          id: '1032',
          navn: 'Nav Lyngdal',
        },
        {
          id: '1034',
          navn: 'Nav Hægebostad',
        },
        {
          id: '1046',
          navn: 'Nav Sirdal',
        },
        {
          id: '1083',
          navn: 'Nav egne ansatte Agder',
        },
        {
          id: '1101',
          navn: 'Nav Dalane',
        },
        {
          id: '1102',
          navn: 'Nav Sandnes',
        },
        {
          id: '1106',
          navn: 'Nav Haugesund-Utsira',
        },
        {
          id: '1111',
          navn: 'Nav Sokndal',
        },
        {
          id: '1112',
          navn: 'Nav Lund',
        },
        {
          id: '1119',
          navn: 'Nav Hå',
        },
        {
          id: '1120',
          navn: 'Nav Klepp-Time',
        },
        {
          id: '1122',
          navn: 'Nav Gjesdal',
        },
        {
          id: '1124',
          navn: 'Nav Sola',
        },
        {
          id: '1127',
          navn: 'Nav Randaberg-Kvitsøy',
        },
        {
          id: '1130',
          navn: 'Nav Strand',
        },
        {
          id: '1133',
          navn: 'Nav Hjelmeland',
        },
        {
          id: '1134',
          navn: 'Nav Suldal',
        },
        {
          id: '1135',
          navn: 'Nav Sauda',
        },
        {
          id: '1146',
          navn: 'Nav Tysvær',
        },
        {
          id: '1149',
          navn: 'Nav Karmøy-Bokn',
        },
        {
          id: '1160',
          navn: 'Nav Vindafjord-Etne',
        },
        {
          id: '1161',
          navn: 'Nav Eiganes og Tasta',
        },
        {
          id: '1162',
          navn: 'Nav Hundvåg og Storhaug',
        },
        {
          id: '1164',
          navn: 'Nav Hillevåg og Hinna',
        },
        {
          id: '1165',
          navn: 'Nav Madla',
        },
        {
          id: '1169',
          navn: 'Nav Rennesøy og Finnøy',
        },
        {
          id: '1183',
          navn: 'Nav egne ansatte Rogaland',
        },
        {
          id: '1202',
          navn: 'Nav Bergen sør',
        },
        {
          id: '1203',
          navn: 'Nav Bergen nord',
        },
        {
          id: '1204',
          navn: 'Nav Arna',
        },
        {
          id: '1205',
          navn: 'Nav Fyllingsdalen',
        },
        {
          id: '1206',
          navn: 'Nav Bergen vest',
        },
        {
          id: '1208',
          navn: 'Nav Årstad',
        },
        {
          id: '1209',
          navn: 'Nav Bergenhus',
        },
        {
          id: '1210',
          navn: 'Nav Ytrebygda',
        },
        {
          id: '1211',
          navn: 'Nav Etne',
        },
        {
          id: '1216',
          navn: 'Nav Sveio',
        },
        {
          id: '1219',
          navn: 'Nav Bømlo',
        },
        {
          id: '1221',
          navn: 'Nav Stord',
        },
        {
          id: '1222',
          navn: 'Nav Fitjar',
        },
        {
          id: '1223',
          navn: 'Nav Tysnes',
        },
        {
          id: '1224',
          navn: 'Nav Kvinnherad',
        },
        {
          id: '1228',
          navn: 'Nav Ullensvang',
        },
        {
          id: '1232',
          navn: 'Nav Eidfjord',
        },
        {
          id: '1233',
          navn: 'Nav Ulvik',
        },
        {
          id: '1235',
          navn: 'Nav Voss',
        },
        {
          id: '1238',
          navn: 'Nav Kvam',
        },
        {
          id: '1242',
          navn: 'Nav Samnanger',
        },
        {
          id: '1243',
          navn: 'Nav Bjørnafjorden',
        },
        {
          id: '1244',
          navn: 'Nav Austevoll',
        },
        {
          id: '1246',
          navn: 'Nav Øygarden',
        },
        {
          id: '1247',
          navn: 'Nav Askøy',
        },
        {
          id: '1251',
          navn: 'Nav Vaksdal',
        },
        {
          id: '1253',
          navn: 'Nav Osterøy',
        },
        {
          id: '1263',
          navn: 'Nav Alver',
        },
        {
          id: '1266',
          navn: 'Nav Fensfjorden',
        },
        {
          id: '1283',
          navn: 'Nav egne ansatte Vestland',
        },
        {
          id: '1401',
          navn: 'Nav Kinn',
        },
        {
          id: '1412',
          navn: 'Nav Solund',
        },
        {
          id: '1413',
          navn: 'Nav Hyllestad',
        },
        {
          id: '1416',
          navn: 'Nav Høyanger',
        },
        {
          id: '1417',
          navn: 'Nav Vik',
        },
        {
          id: '1420',
          navn: 'Nav Sogndal',
        },
        {
          id: '1421',
          navn: 'Nav Aurland',
        },
        {
          id: '1422',
          navn: 'Nav Lærdal',
        },
        {
          id: '1424',
          navn: 'Nav Årdal',
        },
        {
          id: '1426',
          navn: 'Nav Luster',
        },
        {
          id: '1428',
          navn: 'Nav Askvoll',
        },
        {
          id: '1429',
          navn: 'Nav Fjaler',
        },
        {
          id: '1432',
          navn: 'Nav Sunnfjord',
        },
        {
          id: '1438',
          navn: 'Nav Bremanger',
        },
        {
          id: '1443',
          navn: 'Nav Stad',
        },
        {
          id: '1445',
          navn: 'Nav Gloppen',
        },
        {
          id: '1449',
          navn: 'Nav Stryn',
        },
        {
          id: '1502',
          navn: 'Nav Molde',
        },
        {
          id: '1504',
          navn: 'Nav Ålesund',
        },
        {
          id: '1505',
          navn: 'Nav Kristiansund',
        },
        {
          id: '1515',
          navn: 'Nav Herøy og Vanylven',
        },
        {
          id: '1517',
          navn: 'Nav Hareid - Ulstein - Sande',
        },
        {
          id: '1520',
          navn: 'Nav Ørsta Volda',
        },
        {
          id: '1525',
          navn: 'Nav Stranda',
        },
        {
          id: '1528',
          navn: 'Nav Sykkylven - Stranda',
        },
        {
          id: '1529',
          navn: 'Nav Fjord',
        },
        {
          id: '1531',
          navn: 'Nav Sula',
        },
        {
          id: '1532',
          navn: 'Nav Giske',
        },
        {
          id: '1535',
          navn: 'Nav Vestnes',
        },
        {
          id: '1539',
          navn: 'Nav Rauma',
        },
        {
          id: '1547',
          navn: 'Nav Aukra',
        },
        {
          id: '1548',
          navn: 'Nav Hustadvika',
        },
        {
          id: '1554',
          navn: 'Nav Averøy',
        },
        {
          id: '1557',
          navn: 'Nav Gjemnes',
        },
        {
          id: '1560',
          navn: 'Nav Tingvoll',
        },
        {
          id: '1563',
          navn: 'Nav Indre Nordmøre',
        },
        {
          id: '1566',
          navn: 'Nav Surnadal',
        },
        {
          id: '1567',
          navn: 'Nav Rindal',
        },
        {
          id: '1572',
          navn: 'Nav Tustna',
        },
        {
          id: '1573',
          navn: 'Nav Smøla',
        },
        {
          id: '1576',
          navn: 'Nav Aure',
        },
        {
          id: '1583',
          navn: 'Nav egne ansatte Møre og Romsdal',
        },
        {
          id: '1607',
          navn: 'Nav Heimdal',
        },
        {
          id: '1612',
          navn: 'Nav Heim',
        },
        {
          id: '1620',
          navn: 'Nav Hitra Frøya',
        },
        {
          id: '1621',
          navn: 'Nav Ørland',
        },
        {
          id: '1624',
          navn: 'Nav Rissa',
        },
        {
          id: '1627',
          navn: 'Nav Bjugn',
        },
        {
          id: '1630',
          navn: 'Nav Nord-Fosen',
        },
        {
          id: '1634',
          navn: 'Nav Oppdal og Rennebu',
        },
        {
          id: '1638',
          navn: 'Nav Orkland',
        },
        {
          id: '1640',
          navn: 'Nav Røros, Os og Holtålen',
        },
        {
          id: '1644',
          navn: 'Nav Holtålen',
        },
        {
          id: '1648',
          navn: 'Nav Midtre Gauldal',
        },
        {
          id: '1653',
          navn: 'Nav Melhus',
        },
        {
          id: '1657',
          navn: 'Nav Skaun',
        },
        {
          id: '1663',
          navn: 'Nav Malvik',
        },
        {
          id: '1683',
          navn: 'Nav egne ansatte Trøndelag',
        },
        {
          id: '1702',
          navn: 'Nav Inn-Trøndelag',
        },
        {
          id: '1703',
          navn: 'Nav Midtre Namdal',
        },
        {
          id: '1718',
          navn: 'Nav Leksvik',
        },
        {
          id: '1719',
          navn: 'Nav Levanger',
        },
        {
          id: '1721',
          navn: 'Nav Verdal',
        },
        {
          id: '1724',
          navn: 'Nav Verran',
        },
        {
          id: '1725',
          navn: 'Nav Namdalseid',
        },
        {
          id: '1729',
          navn: 'Avviklet - Nav Inderøy',
        },
        {
          id: '1736',
          navn: 'Nav Snåsa',
        },
        {
          id: '1738',
          navn: 'Nav Lierne',
        },
        {
          id: '1739',
          navn: 'Nav Røyrvik',
        },
        {
          id: '1740',
          navn: 'Nav Namsskogan',
        },
        {
          id: '1742',
          navn: 'Nav Indre Namdal',
        },
        {
          id: '1743',
          navn: 'Nav Høylandet',
        },
        {
          id: '1744',
          navn: 'Nav Overhalla',
        },
        {
          id: '1748',
          navn: 'Nav Fosnes',
        },
        {
          id: '1749',
          navn: 'Nav Flatanger',
        },
        {
          id: '1750',
          navn: 'Nav Vikna',
        },
        {
          id: '1751',
          navn: 'Nav Nærøysund',
        },
        {
          id: '1755',
          navn: 'Nav Leka',
        },
        {
          id: '1756',
          navn: 'Nav Inderøy',
        },
        {
          id: '1783',
          navn: 'Nav Værnes',
        },
        {
          id: '1804',
          navn: 'Nav Bodø',
        },
        {
          id: '1805',
          navn: 'Nav Narvik',
        },
        {
          id: '1812',
          navn: 'Nav Sømna',
        },
        {
          id: '1813',
          navn: 'Nav Sør-Helgeland',
        },
        {
          id: '1815',
          navn: 'Nav Vega',
        },
        {
          id: '1816',
          navn: 'Nav Vevelstad',
        },
        {
          id: '1818',
          navn: 'Nav Herøy',
        },
        {
          id: '1820',
          navn: 'Nav Ytre Helgeland',
        },
        {
          id: '1822',
          navn: 'Nav Leirfjord',
        },
        {
          id: '1824',
          navn: 'Nav Vefsna',
        },
        {
          id: '1825',
          navn: 'Nav Grane',
        },
        {
          id: '1826',
          navn: 'Nav Hattfjelldal',
        },
        {
          id: '1827',
          navn: 'Nav Dønna',
        },
        {
          id: '1828',
          navn: 'Nav Nesna',
        },
        {
          id: '1832',
          navn: 'Nav Hemnes',
        },
        {
          id: '1833',
          navn: 'Nav Rana',
        },
        {
          id: '1834',
          navn: 'Nav Lurøy',
        },
        {
          id: '1835',
          navn: 'Nav Træna',
        },
        {
          id: '1836',
          navn: 'Nav Rødøy',
        },
        {
          id: '1837',
          navn: 'Nav Meløy',
        },
        {
          id: '1838',
          navn: 'Nav Gildeskål',
        },
        {
          id: '1839',
          navn: 'Nav Beiarn',
        },
        {
          id: '1840',
          navn: 'Nav Saltdal',
        },
        {
          id: '1841',
          navn: 'Nav Indre Salten',
        },
        {
          id: '1845',
          navn: 'Nav Sørfold',
        },
        {
          id: '1848',
          navn: 'Nav Steigen',
        },
        {
          id: '1849',
          navn: 'Nav Hamarøy',
        },
        {
          id: '1850',
          navn: 'Nav Tysfjord',
        },
        {
          id: '1851',
          navn: 'Nav Lødingen',
        },
        {
          id: '1852',
          navn: 'Nav Evenes og Tjeldsund',
        },
        {
          id: '1854',
          navn: 'Nav Ballangen',
        },
        {
          id: '1856',
          navn: 'Nav Røst',
        },
        {
          id: '1857',
          navn: 'Nav Værøy',
        },
        {
          id: '1859',
          navn: 'Nav Flakstad',
        },
        {
          id: '1860',
          navn: 'Nav Lofoten',
        },
        {
          id: '1865',
          navn: 'Nav Svolvær',
        },
        {
          id: '1866',
          navn: 'Nav Hadsel',
        },
        {
          id: '1867',
          navn: 'Nav Bø',
        },
        {
          id: '1868',
          navn: 'Nav Øksnes',
        },
        {
          id: '1870',
          navn: 'Nav Sortland',
        },
        {
          id: '1871',
          navn: 'Nav Andøy',
        },
        {
          id: '1874',
          navn: 'Nav Moskenes',
        },
        {
          id: '1883',
          navn: 'Nav egne ansatte Nordland',
        },
        {
          id: '1902',
          navn: 'Nav Tromsø',
        },
        {
          id: '1903',
          navn: 'Nav Sør-Troms',
        },
        {
          id: '1911',
          navn: 'Nav Kvæfjord',
        },
        {
          id: '1913',
          navn: 'Nav Tjeldsund',
        },
        {
          id: '1917',
          navn: 'Nav Ibestad',
        },
        {
          id: '1919',
          navn: 'Nav Gratangen',
        },
        {
          id: '1920',
          navn: 'Nav Lavangen',
        },
        {
          id: '1922',
          navn: 'Nav Bardu',
        },
        {
          id: '1923',
          navn: 'Nav Salangen-Lavangen-Dyrøy',
        },
        {
          id: '1924',
          navn: 'Nav Målselv-Bardu',
        },
        {
          id: '1925',
          navn: 'Nav Sørreisa',
        },
        {
          id: '1926',
          navn: 'Nav Dyrøy',
        },
        {
          id: '1927',
          navn: 'Nav Tranøy',
        },
        {
          id: '1928',
          navn: 'Nav Torsken',
        },
        {
          id: '1929',
          navn: 'Nav Berg',
        },
        {
          id: '1931',
          navn: 'Nav Senja-Sørreisa',
        },
        {
          id: '1933',
          navn: 'Nav Balsfjord-Storfjord',
        },
        {
          id: '1936',
          navn: 'Nav Karlsøy',
        },
        {
          id: '1938',
          navn: 'Nav Lyngen',
        },
        {
          id: '1939',
          navn: 'Nav Storfjord',
        },
        {
          id: '1940',
          navn: 'Nav Gáivuotna/Kåfjord',
        },
        {
          id: '1941',
          navn: 'Nav Skjervøy',
        },
        {
          id: '1942',
          navn: 'Nav Nordreisa',
        },
        {
          id: '1943',
          navn: 'Nav Kvænangen',
        },
        {
          id: '1983',
          navn: 'Nav egne ansatte Troms og Finnmark',
        },
        {
          id: '2002',
          navn: 'Nav Vardø',
        },
        {
          id: '2003',
          navn: 'Nav Vadsø',
        },
        {
          id: '2004',
          navn: 'Nav Hammerfest-Måsøy',
        },
        {
          id: '2011',
          navn: 'Nav Guovdageaidnu/Kautokeino',
        },
        {
          id: '2012',
          navn: 'Nav Alta-Kvænangen-Loppa',
        },
        {
          id: '2014',
          navn: 'Nav Loppa',
        },
        {
          id: '2015',
          navn: 'Nav Hasvik',
        },
        {
          id: '2017',
          navn: 'Nav Kvalsund',
        },
        {
          id: '2018',
          navn: 'Nav Måsøy',
        },
        {
          id: '2019',
          navn: 'Nav Nordkapp',
        },
        {
          id: '2020',
          navn: 'Nav Porsanger',
        },
        {
          id: '2021',
          navn: 'Nav Karasjohka/Karasjok',
        },
        {
          id: '2022',
          navn: 'Nav Lebesby',
        },
        {
          id: '2023',
          navn: 'Nav Gamvik',
        },
        {
          id: '2024',
          navn: 'Nav Berlevåg',
        },
        {
          id: '2025',
          navn: 'Nav Deatnu/Tana',
        },
        {
          id: '2027',
          navn: 'Nav Unjárga/Nesseby',
        },
        {
          id: '2028',
          navn: 'Nav Båtsfjord',
        },
        {
          id: '2030',
          navn: 'Nav Sør-Varanger',
        },
        {
          id: '4154',
          navn: 'Nasjonal oppfølgingsenhet',
        },
        {
          id: '5701',
          navn: 'Nav Falkenborg',
        },
        {
          id: '5702',
          navn: 'Nav Lerkendal',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '34',
      navn: 'Oppfølgingssak - Tiltaksplass',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '40',
            navn: 'Arbeidsmarkedsloven',
            beskrivelse: 'Arbeidsmarkedsloven',
          },
          registreringshjemler: [
            {
              id: 'ARBML_2',
              navn: '§ 2',
            },
            {
              id: '708',
              navn: '§ 12',
            },
            {
              id: 'ARBML_16',
              navn: '§ 16',
            },
            {
              id: '709',
              navn: '§ 17',
            },
          ],
        },
        {
          lovkilde: {
            id: '41',
            navn: 'Forskrift om tiltak',
            beskrivelse: 'Tiltaksforskriften',
          },
          registreringshjemler: [
            {
              id: 'FS_TIL_1_3',
              navn: '§ 1-3',
            },
            {
              id: 'FS_TIL_1_6',
              navn: '§ 1-6',
            },
            {
              id: '710',
              navn: 'kap. 2',
            },
            {
              id: '711',
              navn: 'kap. 3',
            },
            {
              id: '712',
              navn: 'kap. 4',
            },
            {
              id: '713',
              navn: 'kap. 5',
            },
            {
              id: '714',
              navn: 'kap. 6',
            },
            {
              id: '715',
              navn: 'kap. 7',
            },
            {
              id: '716',
              navn: 'kap. 8',
            },
            {
              id: '717',
              navn: 'kap. 9',
            },
            {
              id: '718',
              navn: 'kap. 10',
            },
            {
              id: '719',
              navn: 'kap. 11',
            },
            {
              id: '720',
              navn: 'kap. 12',
            },
            {
              id: '721',
              navn: 'kap. 13',
            },
            {
              id: '722',
              navn: 'kap. 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '73',
            navn: 'Forskrift til forvaltningsloven',
            beskrivelse: 'Forskrift til forvaltningsloven',
          },
          registreringshjemler: [
            {
              id: 'FVL_FS_33',
              navn: '§ 33',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '0387',
          navn: 'Nav Tiltak Oslo',
        },
        {
          id: '0587',
          navn: 'Nav Tiltak Innlandet',
        },
        {
          id: '0687',
          navn: 'Nav Tiltak Vest-Viken',
        },
        {
          id: '1087',
          navn: 'Nav Tiltak Agder',
        },
        {
          id: '1187',
          navn: 'Nav Tiltak Rogaland',
        },
        {
          id: '1287',
          navn: 'Nav Tiltak Vestland',
        },
        {
          id: '1987',
          navn: 'Nav Tiltak Troms og Finnmark',
        },
        {
          id: '5771',
          navn: 'Nav Tiltak Trøndelag',
        },
        {
          id: '0287',
          navn: 'Nav Tiltak Øst-Viken',
        },
        {
          id: '0101',
          navn: 'Nav Halden-Aremark',
        },
        {
          id: '0104',
          navn: 'Nav Moss',
        },
        {
          id: '0105',
          navn: 'Nav Sarpsborg',
        },
        {
          id: '0106',
          navn: 'Nav Fredrikstad',
        },
        {
          id: '0111',
          navn: 'Nav Hvaler',
        },
        {
          id: '0119',
          navn: 'Nav Skiptvet Marker',
        },
        {
          id: '0124',
          navn: 'Nav Indre Østfold',
        },
        {
          id: '0127',
          navn: 'Nav Skiptvet',
        },
        {
          id: '0128',
          navn: 'Nav Rakkestad',
        },
        {
          id: '0135',
          navn: 'Nav Råde',
        },
        {
          id: '0137',
          navn: 'Nav Våler i Viken',
        },
        {
          id: '1037',
          navn: 'Nav Lister',
        },
        {
          id: '0211',
          navn: 'Nav Vestby',
        },
        {
          id: '0213',
          navn: 'Nav Nordre Follo',
        },
        {
          id: '0214',
          navn: 'Nav Ås',
        },
        {
          id: '0215',
          navn: 'Nav Frogn',
        },
        {
          id: '0219',
          navn: 'Nav Bærum',
        },
        {
          id: '0220',
          navn: 'Nav Asker',
        },
        {
          id: '0221',
          navn: 'Nav Aurskog-Høland',
        },
        {
          id: '0228',
          navn: 'Nav Rælingen',
        },
        {
          id: '0229',
          navn: 'Nav Enebakk',
        },
        {
          id: '0230',
          navn: 'Nav Lørenskog',
        },
        {
          id: '0231',
          navn: 'Nav Lillestrøm',
        },
        {
          id: '0233',
          navn: 'Nav Nittedal',
        },
        {
          id: '0234',
          navn: 'Nav Gjerdrum',
        },
        {
          id: '0235',
          navn: 'Nav Ullensaker',
        },
        {
          id: '0236',
          navn: 'Nav Nes i Akershus',
        },
        {
          id: '0237',
          navn: 'Nav Eidsvoll',
        },
        {
          id: '0238',
          navn: 'Nav Nannestad Gjerdrum',
        },
        {
          id: '0239',
          navn: 'Nav Hurdal',
        },
        {
          id: '0283',
          navn: 'Nav egne ansatte Øst-Viken',
        },
        {
          id: '0291',
          navn: 'Nav arbeidslivssenter Øst-Viken',
        },
        {
          id: '0312',
          navn: 'Nav Frogner',
        },
        {
          id: '0313',
          navn: 'Nav St. Hanshaugen',
        },
        {
          id: '0314',
          navn: 'Nav Sagene',
        },
        {
          id: '0315',
          navn: 'Nav Grünerløkka',
        },
        {
          id: '0316',
          navn: 'Nav Gamle Oslo',
        },
        {
          id: '0318',
          navn: 'Nav Nordstrand',
        },
        {
          id: '0319',
          navn: 'Nav Søndre Nordstrand',
        },
        {
          id: '0321',
          navn: 'Nav Østensjø',
        },
        {
          id: '0326',
          navn: 'Nav Alna',
        },
        {
          id: '0327',
          navn: 'Nav Stovner',
        },
        {
          id: '0328',
          navn: 'Nav Grorud',
        },
        {
          id: '0330',
          navn: 'Nav Bjerke',
        },
        {
          id: '0331',
          navn: 'Nav Nordre Aker',
        },
        {
          id: '0334',
          navn: 'Nav Vestre Aker',
        },
        {
          id: '0383',
          navn: 'Nav egne ansatte Oslo',
        },
        {
          id: '0386',
          navn: 'Nav Oslo digital oppfølging',
        },
        {
          id: '0402',
          navn: 'Nav Kongsvinger',
        },
        {
          id: '0403',
          navn: 'Nav Hamar',
        },
        {
          id: '0412',
          navn: 'Nav Ringsaker',
        },
        {
          id: '0415',
          navn: 'Nav Løten',
        },
        {
          id: '0417',
          navn: 'Nav Stange',
        },
        {
          id: '0418',
          navn: 'Nav Nord-Odal',
        },
        {
          id: '0420',
          navn: 'Nav Eidskog',
        },
        {
          id: '0423',
          navn: 'Nav Grue',
        },
        {
          id: '0425',
          navn: 'Nav Åsnes',
        },
        {
          id: '0426',
          navn: 'Nav Våler i Hedmark',
        },
        {
          id: '0427',
          navn: 'Nav Elverum',
        },
        {
          id: '0428',
          navn: 'Nav Trysil',
        },
        {
          id: '0429',
          navn: 'Nav Åmot',
        },
        {
          id: '0430',
          navn: 'Nav Stor-Elvdal',
        },
        {
          id: '0434',
          navn: 'Nav Engerdal',
        },
        {
          id: '0437',
          navn: 'Nav Nord-Østerdal',
        },
        {
          id: '0439',
          navn: 'Nav Folldal',
        },
        {
          id: '0450',
          navn: 'ENHET FOR ARBEIDSGIVER- OG ARBEIDSTAKERREGISTERET',
        },
        {
          id: '0483',
          navn: 'Nav egne ansatte Innlandet',
        },
        {
          id: '0491',
          navn: 'Nav Arbeidslivssenter Innlandet',
        },
        {
          id: '0501',
          navn: 'Nav Lillehammer-Gausdal',
        },
        {
          id: '0502',
          navn: 'Nav Gjøvik',
        },
        {
          id: '0511',
          navn: 'Nav Lesja - Dovre',
        },
        {
          id: '0513',
          navn: 'Nav Lom-Skjåk',
        },
        {
          id: '0515',
          navn: 'Nav Vågå',
        },
        {
          id: '0516',
          navn: 'Nav Midt-Gudbrandsdal',
        },
        {
          id: '0517',
          navn: 'Nav Sel',
        },
        {
          id: '0519',
          navn: 'Nav Sør-Fron',
        },
        {
          id: '0521',
          navn: 'Nav Øyer',
        },
        {
          id: '0528',
          navn: 'Nav Østre Toten',
        },
        {
          id: '0529',
          navn: 'Nav Vestre Toten',
        },
        {
          id: '0532',
          navn: 'Nav Jevnaker',
        },
        {
          id: '0534',
          navn: 'Nav Hadeland',
        },
        {
          id: '0536',
          navn: 'Nav Søndre Land',
        },
        {
          id: '0538',
          navn: 'Nav Nordre Land',
        },
        {
          id: '0542',
          navn: 'Nav Valdres',
        },
        {
          id: '0600',
          navn: 'Nav Vest-Viken',
        },
        {
          id: '0602',
          navn: 'Nav Drammen',
        },
        {
          id: '0604',
          navn: 'Nav Kongsberg',
        },
        {
          id: '0605',
          navn: 'Nav Ringerike',
        },
        {
          id: '0612',
          navn: 'Nav Hole',
        },
        {
          id: '0617',
          navn: 'Nav Hallingdal',
        },
        {
          id: '0621',
          navn: 'Nav Sigdal',
        },
        {
          id: '0622',
          navn: 'Nav Krødsherad',
        },
        {
          id: '0623',
          navn: 'Nav Midt-Buskerud',
        },
        {
          id: '0624',
          navn: 'Nav Øvre Eiker',
        },
        {
          id: '0626',
          navn: 'Nav Lier',
        },
        {
          id: '0632',
          navn: 'Nav Numedal',
        },
        {
          id: '0683',
          navn: 'Nav egne ansatte Vest-Viken',
        },
        {
          id: '0701',
          navn: 'Nav Horten',
        },
        {
          id: '0704',
          navn: 'Nav Tønsberg',
        },
        {
          id: '0710',
          navn: 'Nav Sandefjord',
        },
        {
          id: '5301',
          navn: 'Nav Holmestrand',
        },
        {
          id: '5303',
          navn: 'Nav Larvik',
        },
        {
          id: '5302',
          navn: 'Nav Færder',
        },
        {
          id: '0800',
          navn: 'Nav Vestfold og Telemark',
        },
        {
          id: '0805',
          navn: 'Nav Porsgrunn',
        },
        {
          id: '0806',
          navn: 'Nav Skien',
        },
        {
          id: '0811',
          navn: 'Nav Siljan',
        },
        {
          id: '0814',
          navn: 'Nav Bamble',
        },
        {
          id: '0815',
          navn: 'Nav Kragerø',
        },
        {
          id: '0817',
          navn: 'Nav Drangedal',
        },
        {
          id: '0821',
          navn: 'Nav Midt-Telemark',
        },
        {
          id: '0826',
          navn: 'Nav Tinn',
        },
        {
          id: '0833',
          navn: 'Nav Vest-Telemark',
        },
        {
          id: '0883',
          navn: 'Nav egne ansatte Vestfold og Telemark',
        },
        {
          id: '0904',
          navn: 'Nav Grimstad',
        },
        {
          id: '0906',
          navn: 'Nav Arendal',
        },
        {
          id: '0901',
          navn: 'Nav Risør',
        },
        {
          id: '0911',
          navn: 'Nav Gjerstad',
        },
        {
          id: '0914',
          navn: 'Nav Øst i Agder',
        },
        {
          id: '0919',
          navn: 'Nav Froland',
        },
        {
          id: '0928',
          navn: 'Nav Birkenes',
        },
        {
          id: '0929',
          navn: 'Nav Åmli',
        },
        {
          id: '0937',
          navn: 'Nav Evje og Hornnes',
        },
        {
          id: '0926',
          navn: 'Nav Lillesand',
        },
        {
          id: '1001',
          navn: 'Nav Kristiansand',
        },
        {
          id: '1002',
          navn: 'Nav Lindesnes',
        },
        {
          id: '1014',
          navn: 'Nav Midt-Agder',
        },
        {
          id: '1004',
          navn: 'Nav Flekkefjord',
        },
        {
          id: '1032',
          navn: 'Nav Lyngdal',
        },
        {
          id: '1034',
          navn: 'Nav Hægebostad',
        },
        {
          id: '1046',
          navn: 'Nav Sirdal',
        },
        {
          id: '1083',
          navn: 'Nav egne ansatte Agder',
        },
        {
          id: '1101',
          navn: 'Nav Dalane',
        },
        {
          id: '1102',
          navn: 'Nav Sandnes',
        },
        {
          id: '1106',
          navn: 'Nav Haugesund-Utsira',
        },
        {
          id: '1111',
          navn: 'Nav Sokndal',
        },
        {
          id: '1112',
          navn: 'Nav Lund',
        },
        {
          id: '1119',
          navn: 'Nav Hå',
        },
        {
          id: '1120',
          navn: 'Nav Klepp-Time',
        },
        {
          id: '1122',
          navn: 'Nav Gjesdal',
        },
        {
          id: '1124',
          navn: 'Nav Sola',
        },
        {
          id: '1127',
          navn: 'Nav Randaberg-Kvitsøy',
        },
        {
          id: '1130',
          navn: 'Nav Strand',
        },
        {
          id: '1133',
          navn: 'Nav Hjelmeland',
        },
        {
          id: '1134',
          navn: 'Nav Suldal',
        },
        {
          id: '1135',
          navn: 'Nav Sauda',
        },
        {
          id: '1146',
          navn: 'Nav Tysvær',
        },
        {
          id: '1149',
          navn: 'Nav Karmøy-Bokn',
        },
        {
          id: '1160',
          navn: 'Nav Vindafjord-Etne',
        },
        {
          id: '1161',
          navn: 'Nav Eiganes og Tasta',
        },
        {
          id: '1162',
          navn: 'Nav Hundvåg og Storhaug',
        },
        {
          id: '1164',
          navn: 'Nav Hillevåg og Hinna',
        },
        {
          id: '1165',
          navn: 'Nav Madla',
        },
        {
          id: '1169',
          navn: 'Nav Rennesøy og Finnøy',
        },
        {
          id: '1183',
          navn: 'Nav egne ansatte Rogaland',
        },
        {
          id: '1202',
          navn: 'Nav Bergen sør',
        },
        {
          id: '1203',
          navn: 'Nav Bergen nord',
        },
        {
          id: '1204',
          navn: 'Nav Arna',
        },
        {
          id: '1205',
          navn: 'Nav Fyllingsdalen',
        },
        {
          id: '1206',
          navn: 'Nav Bergen vest',
        },
        {
          id: '1208',
          navn: 'Nav Årstad',
        },
        {
          id: '1209',
          navn: 'Nav Bergenhus',
        },
        {
          id: '1210',
          navn: 'Nav Ytrebygda',
        },
        {
          id: '1211',
          navn: 'Nav Etne',
        },
        {
          id: '1216',
          navn: 'Nav Sveio',
        },
        {
          id: '1219',
          navn: 'Nav Bømlo',
        },
        {
          id: '1221',
          navn: 'Nav Stord',
        },
        {
          id: '1222',
          navn: 'Nav Fitjar',
        },
        {
          id: '1223',
          navn: 'Nav Tysnes',
        },
        {
          id: '1224',
          navn: 'Nav Kvinnherad',
        },
        {
          id: '1228',
          navn: 'Nav Ullensvang',
        },
        {
          id: '1232',
          navn: 'Nav Eidfjord',
        },
        {
          id: '1233',
          navn: 'Nav Ulvik',
        },
        {
          id: '1235',
          navn: 'Nav Voss',
        },
        {
          id: '1238',
          navn: 'Nav Kvam',
        },
        {
          id: '1242',
          navn: 'Nav Samnanger',
        },
        {
          id: '1243',
          navn: 'Nav Bjørnafjorden',
        },
        {
          id: '1244',
          navn: 'Nav Austevoll',
        },
        {
          id: '1246',
          navn: 'Nav Øygarden',
        },
        {
          id: '1247',
          navn: 'Nav Askøy',
        },
        {
          id: '1251',
          navn: 'Nav Vaksdal',
        },
        {
          id: '1253',
          navn: 'Nav Osterøy',
        },
        {
          id: '1263',
          navn: 'Nav Alver',
        },
        {
          id: '1266',
          navn: 'Nav Fensfjorden',
        },
        {
          id: '1283',
          navn: 'Nav egne ansatte Vestland',
        },
        {
          id: '1401',
          navn: 'Nav Kinn',
        },
        {
          id: '1412',
          navn: 'Nav Solund',
        },
        {
          id: '1413',
          navn: 'Nav Hyllestad',
        },
        {
          id: '1416',
          navn: 'Nav Høyanger',
        },
        {
          id: '1417',
          navn: 'Nav Vik',
        },
        {
          id: '1420',
          navn: 'Nav Sogndal',
        },
        {
          id: '1421',
          navn: 'Nav Aurland',
        },
        {
          id: '1422',
          navn: 'Nav Lærdal',
        },
        {
          id: '1424',
          navn: 'Nav Årdal',
        },
        {
          id: '1426',
          navn: 'Nav Luster',
        },
        {
          id: '1428',
          navn: 'Nav Askvoll',
        },
        {
          id: '1429',
          navn: 'Nav Fjaler',
        },
        {
          id: '1432',
          navn: 'Nav Sunnfjord',
        },
        {
          id: '1438',
          navn: 'Nav Bremanger',
        },
        {
          id: '1443',
          navn: 'Nav Stad',
        },
        {
          id: '1445',
          navn: 'Nav Gloppen',
        },
        {
          id: '1449',
          navn: 'Nav Stryn',
        },
        {
          id: '1502',
          navn: 'Nav Molde',
        },
        {
          id: '1504',
          navn: 'Nav Ålesund',
        },
        {
          id: '1505',
          navn: 'Nav Kristiansund',
        },
        {
          id: '1515',
          navn: 'Nav Herøy og Vanylven',
        },
        {
          id: '1517',
          navn: 'Nav Hareid - Ulstein - Sande',
        },
        {
          id: '1520',
          navn: 'Nav Ørsta Volda',
        },
        {
          id: '1525',
          navn: 'Nav Stranda',
        },
        {
          id: '1528',
          navn: 'Nav Sykkylven - Stranda',
        },
        {
          id: '1529',
          navn: 'Nav Fjord',
        },
        {
          id: '1531',
          navn: 'Nav Sula',
        },
        {
          id: '1532',
          navn: 'Nav Giske',
        },
        {
          id: '1535',
          navn: 'Nav Vestnes',
        },
        {
          id: '1539',
          navn: 'Nav Rauma',
        },
        {
          id: '1547',
          navn: 'Nav Aukra',
        },
        {
          id: '1548',
          navn: 'Nav Hustadvika',
        },
        {
          id: '1554',
          navn: 'Nav Averøy',
        },
        {
          id: '1557',
          navn: 'Nav Gjemnes',
        },
        {
          id: '1560',
          navn: 'Nav Tingvoll',
        },
        {
          id: '1563',
          navn: 'Nav Indre Nordmøre',
        },
        {
          id: '1566',
          navn: 'Nav Surnadal',
        },
        {
          id: '1567',
          navn: 'Nav Rindal',
        },
        {
          id: '1572',
          navn: 'Nav Tustna',
        },
        {
          id: '1573',
          navn: 'Nav Smøla',
        },
        {
          id: '1576',
          navn: 'Nav Aure',
        },
        {
          id: '1583',
          navn: 'Nav egne ansatte Møre og Romsdal',
        },
        {
          id: '1607',
          navn: 'Nav Heimdal',
        },
        {
          id: '1612',
          navn: 'Nav Heim',
        },
        {
          id: '1620',
          navn: 'Nav Hitra Frøya',
        },
        {
          id: '1621',
          navn: 'Nav Ørland',
        },
        {
          id: '1624',
          navn: 'Nav Rissa',
        },
        {
          id: '1627',
          navn: 'Nav Bjugn',
        },
        {
          id: '1630',
          navn: 'Nav Nord-Fosen',
        },
        {
          id: '1634',
          navn: 'Nav Oppdal og Rennebu',
        },
        {
          id: '1638',
          navn: 'Nav Orkland',
        },
        {
          id: '1640',
          navn: 'Nav Røros, Os og Holtålen',
        },
        {
          id: '1644',
          navn: 'Nav Holtålen',
        },
        {
          id: '1648',
          navn: 'Nav Midtre Gauldal',
        },
        {
          id: '1653',
          navn: 'Nav Melhus',
        },
        {
          id: '1657',
          navn: 'Nav Skaun',
        },
        {
          id: '1663',
          navn: 'Nav Malvik',
        },
        {
          id: '1683',
          navn: 'Nav egne ansatte Trøndelag',
        },
        {
          id: '1702',
          navn: 'Nav Inn-Trøndelag',
        },
        {
          id: '1703',
          navn: 'Nav Midtre Namdal',
        },
        {
          id: '1718',
          navn: 'Nav Leksvik',
        },
        {
          id: '1719',
          navn: 'Nav Levanger',
        },
        {
          id: '1721',
          navn: 'Nav Verdal',
        },
        {
          id: '1724',
          navn: 'Nav Verran',
        },
        {
          id: '1725',
          navn: 'Nav Namdalseid',
        },
        {
          id: '1729',
          navn: 'Avviklet - Nav Inderøy',
        },
        {
          id: '1736',
          navn: 'Nav Snåsa',
        },
        {
          id: '1738',
          navn: 'Nav Lierne',
        },
        {
          id: '1739',
          navn: 'Nav Røyrvik',
        },
        {
          id: '1740',
          navn: 'Nav Namsskogan',
        },
        {
          id: '1742',
          navn: 'Nav Indre Namdal',
        },
        {
          id: '1743',
          navn: 'Nav Høylandet',
        },
        {
          id: '1744',
          navn: 'Nav Overhalla',
        },
        {
          id: '1748',
          navn: 'Nav Fosnes',
        },
        {
          id: '1749',
          navn: 'Nav Flatanger',
        },
        {
          id: '1750',
          navn: 'Nav Vikna',
        },
        {
          id: '1751',
          navn: 'Nav Nærøysund',
        },
        {
          id: '1755',
          navn: 'Nav Leka',
        },
        {
          id: '1756',
          navn: 'Nav Inderøy',
        },
        {
          id: '1783',
          navn: 'Nav Værnes',
        },
        {
          id: '1800',
          navn: 'Nav Nordland',
        },
        {
          id: '1804',
          navn: 'Nav Bodø',
        },
        {
          id: '1805',
          navn: 'Nav Narvik',
        },
        {
          id: '1812',
          navn: 'Nav Sømna',
        },
        {
          id: '1813',
          navn: 'Nav Sør-Helgeland',
        },
        {
          id: '1815',
          navn: 'Nav Vega',
        },
        {
          id: '1816',
          navn: 'Nav Vevelstad',
        },
        {
          id: '1818',
          navn: 'Nav Herøy',
        },
        {
          id: '1820',
          navn: 'Nav Ytre Helgeland',
        },
        {
          id: '1822',
          navn: 'Nav Leirfjord',
        },
        {
          id: '1824',
          navn: 'Nav Vefsna',
        },
        {
          id: '1825',
          navn: 'Nav Grane',
        },
        {
          id: '1826',
          navn: 'Nav Hattfjelldal',
        },
        {
          id: '1827',
          navn: 'Nav Dønna',
        },
        {
          id: '1828',
          navn: 'Nav Nesna',
        },
        {
          id: '1832',
          navn: 'Nav Hemnes',
        },
        {
          id: '1833',
          navn: 'Nav Rana',
        },
        {
          id: '1834',
          navn: 'Nav Lurøy',
        },
        {
          id: '1835',
          navn: 'Nav Træna',
        },
        {
          id: '1836',
          navn: 'Nav Rødøy',
        },
        {
          id: '1837',
          navn: 'Nav Meløy',
        },
        {
          id: '1838',
          navn: 'Nav Gildeskål',
        },
        {
          id: '1839',
          navn: 'Nav Beiarn',
        },
        {
          id: '1840',
          navn: 'Nav Saltdal',
        },
        {
          id: '1841',
          navn: 'Nav Indre Salten',
        },
        {
          id: '1845',
          navn: 'Nav Sørfold',
        },
        {
          id: '1848',
          navn: 'Nav Steigen',
        },
        {
          id: '1849',
          navn: 'Nav Hamarøy',
        },
        {
          id: '1850',
          navn: 'Nav Tysfjord',
        },
        {
          id: '1851',
          navn: 'Nav Lødingen',
        },
        {
          id: '1852',
          navn: 'Nav Evenes og Tjeldsund',
        },
        {
          id: '1854',
          navn: 'Nav Ballangen',
        },
        {
          id: '1856',
          navn: 'Nav Røst',
        },
        {
          id: '1857',
          navn: 'Nav Værøy',
        },
        {
          id: '1859',
          navn: 'Nav Flakstad',
        },
        {
          id: '1860',
          navn: 'Nav Lofoten',
        },
        {
          id: '1865',
          navn: 'Nav Svolvær',
        },
        {
          id: '1866',
          navn: 'Nav Hadsel',
        },
        {
          id: '1867',
          navn: 'Nav Bø',
        },
        {
          id: '1868',
          navn: 'Nav Øksnes',
        },
        {
          id: '1870',
          navn: 'Nav Sortland',
        },
        {
          id: '1871',
          navn: 'Nav Andøy',
        },
        {
          id: '1874',
          navn: 'Nav Moskenes',
        },
        {
          id: '1883',
          navn: 'Nav egne ansatte Nordland',
        },
        {
          id: '1902',
          navn: 'Nav Tromsø',
        },
        {
          id: '1903',
          navn: 'Nav Sør-Troms',
        },
        {
          id: '1911',
          navn: 'Nav Kvæfjord',
        },
        {
          id: '1913',
          navn: 'Nav Tjeldsund',
        },
        {
          id: '1917',
          navn: 'Nav Ibestad',
        },
        {
          id: '1919',
          navn: 'Nav Gratangen',
        },
        {
          id: '1920',
          navn: 'Nav Lavangen',
        },
        {
          id: '1922',
          navn: 'Nav Bardu',
        },
        {
          id: '1923',
          navn: 'Nav Salangen-Lavangen-Dyrøy',
        },
        {
          id: '1924',
          navn: 'Nav Målselv-Bardu',
        },
        {
          id: '1925',
          navn: 'Nav Sørreisa',
        },
        {
          id: '1926',
          navn: 'Nav Dyrøy',
        },
        {
          id: '1927',
          navn: 'Nav Tranøy',
        },
        {
          id: '1928',
          navn: 'Nav Torsken',
        },
        {
          id: '1929',
          navn: 'Nav Berg',
        },
        {
          id: '1931',
          navn: 'Nav Senja-Sørreisa',
        },
        {
          id: '1933',
          navn: 'Nav Balsfjord-Storfjord',
        },
        {
          id: '1936',
          navn: 'Nav Karlsøy',
        },
        {
          id: '1938',
          navn: 'Nav Lyngen',
        },
        {
          id: '1939',
          navn: 'Nav Storfjord',
        },
        {
          id: '1940',
          navn: 'Nav Gáivuotna/Kåfjord',
        },
        {
          id: '1941',
          navn: 'Nav Skjervøy',
        },
        {
          id: '1942',
          navn: 'Nav Nordreisa',
        },
        {
          id: '1943',
          navn: 'Nav Kvænangen',
        },
        {
          id: '1983',
          navn: 'Nav egne ansatte Troms og Finnmark',
        },
        {
          id: '2002',
          navn: 'Nav Vardø',
        },
        {
          id: '2003',
          navn: 'Nav Vadsø',
        },
        {
          id: '2004',
          navn: 'Nav Hammerfest-Måsøy',
        },
        {
          id: '2011',
          navn: 'Nav Guovdageaidnu/Kautokeino',
        },
        {
          id: '2012',
          navn: 'Nav Alta-Kvænangen-Loppa',
        },
        {
          id: '2014',
          navn: 'Nav Loppa',
        },
        {
          id: '2015',
          navn: 'Nav Hasvik',
        },
        {
          id: '2017',
          navn: 'Nav Kvalsund',
        },
        {
          id: '2018',
          navn: 'Nav Måsøy',
        },
        {
          id: '2019',
          navn: 'Nav Nordkapp',
        },
        {
          id: '2020',
          navn: 'Nav Porsanger',
        },
        {
          id: '2021',
          navn: 'Nav Karasjohka/Karasjok',
        },
        {
          id: '2022',
          navn: 'Nav Lebesby',
        },
        {
          id: '2023',
          navn: 'Nav Gamvik',
        },
        {
          id: '2024',
          navn: 'Nav Berlevåg',
        },
        {
          id: '2025',
          navn: 'Nav Deatnu/Tana',
        },
        {
          id: '2027',
          navn: 'Nav Unjárga/Nesseby',
        },
        {
          id: '2028',
          navn: 'Nav Båtsfjord',
        },
        {
          id: '2030',
          navn: 'Nav Sør-Varanger',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
        {
          id: '5701',
          navn: 'Nav Falkenborg',
        },
        {
          id: '5702',
          navn: 'Nav Lerkendal',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '53',
      navn: 'Partsinnsyn',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: 'FVL_18',
              navn: '§ 18',
            },
            {
              id: 'FVL_18_A',
              navn: '§ 18 a',
            },
            {
              id: 'FVL_18_B',
              navn: '§ 18 b',
            },
            {
              id: 'FVL_18_C',
              navn: '§ 18 c',
            },
            {
              id: 'FVL_18_D',
              navn: '§ 18 d',
            },
            {
              id: 'FVL_19',
              navn: '§ 19',
            },
            {
              id: 'FVL_20',
              navn: '§ 20',
            },
            {
              id: '122',
              navn: '§ 21',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4100',
          navn: 'Nav styringsenhet kontaktsenter',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '42',
      navn: 'Støtte til arbeids- og utdanningsreiser',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '45',
            navn: 'Forskrift om arbeids- og utdanningsreiser',
            beskrivelse: 'Forskrift om stønad til arbeids- og utdanningsreiser',
          },
          registreringshjemler: [
            {
              id: '752',
              navn: '§ 2',
            },
            {
              id: '753',
              navn: '§ 3',
            },
            {
              id: '754',
              navn: '§ 4',
            },
            {
              id: '755',
              navn: '§ 5',
            },
            {
              id: '756',
              navn: '§ 6',
            },
            {
              id: '757',
              navn: '§ 8',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '0587',
          navn: 'Nav Tiltak Innlandet',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '31',
      navn: 'Supplerende stønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '39',
            navn: 'Lov om supplerende stønad',
            beskrivelse: 'Lov om supplerande stønad ved kort butid',
          },
          registreringshjemler: [
            {
              id: 'SUP_ST_L_2',
              navn: '§ 2',
            },
            {
              id: '696',
              navn: '§ 3',
            },
            {
              id: '697',
              navn: '§ 4',
            },
            {
              id: '698',
              navn: '§ 5',
            },
            {
              id: '699',
              navn: '§ 6',
            },
            {
              id: '700',
              navn: '§ 7',
            },
            {
              id: '701',
              navn: '§ 8',
            },
            {
              id: '702',
              navn: '§ 9',
            },
            {
              id: '703',
              navn: '§ 10',
            },
            {
              id: '704',
              navn: '§ 11',
            },
            {
              id: '705',
              navn: '§ 12',
            },
            {
              id: '706',
              navn: '§ 13',
            },
            {
              id: '839',
              navn: '§ 17',
            },
            {
              id: '707',
              navn: '§ 18',
            },
            {
              id: '840',
              navn: '§ 21',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '696',
          navn: 'Lov om supplerande stønad ved kort butid - § 3',
          beskrivelse: 'Lov om supplerende stønad - § 3',
        },
        {
          id: '697',
          navn: 'Lov om supplerande stønad ved kort butid - § 4',
          beskrivelse: 'Lov om supplerende stønad - § 4',
        },
        {
          id: '698',
          navn: 'Lov om supplerande stønad ved kort butid - § 5',
          beskrivelse: 'Lov om supplerende stønad - § 5',
        },
        {
          id: '699',
          navn: 'Lov om supplerande stønad ved kort butid - § 6',
          beskrivelse: 'Lov om supplerende stønad - § 6',
        },
        {
          id: '700',
          navn: 'Lov om supplerande stønad ved kort butid - § 7',
          beskrivelse: 'Lov om supplerende stønad - § 7',
        },
        {
          id: '701',
          navn: 'Lov om supplerande stønad ved kort butid - § 8',
          beskrivelse: 'Lov om supplerende stønad - § 8',
        },
        {
          id: '702',
          navn: 'Lov om supplerande stønad ved kort butid - § 9',
          beskrivelse: 'Lov om supplerende stønad - § 9',
        },
        {
          id: '703',
          navn: 'Lov om supplerande stønad ved kort butid - § 10',
          beskrivelse: 'Lov om supplerende stønad - § 10',
        },
        {
          id: '704',
          navn: 'Lov om supplerande stønad ved kort butid - § 11',
          beskrivelse: 'Lov om supplerende stønad - § 11',
        },
        {
          id: '705',
          navn: 'Lov om supplerande stønad ved kort butid - § 12',
          beskrivelse: 'Lov om supplerende stønad - § 12',
        },
        {
          id: '706',
          navn: 'Lov om supplerande stønad ved kort butid - § 13',
          beskrivelse: 'Lov om supplerende stønad - § 13',
        },
        {
          id: '839',
          navn: 'Lov om supplerande stønad ved kort butid - § 17',
          beskrivelse: 'Lov om supplerende stønad - § 17',
        },
        {
          id: '707',
          navn: 'Lov om supplerande stønad ved kort butid - § 18',
          beskrivelse: 'Lov om supplerende stønad - § 18',
        },
        {
          id: '840',
          navn: 'Lov om supplerande stønad ved kort butid - § 21',
          beskrivelse: 'Lov om supplerende stønad - § 21',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
      ],
    },
    {
      id: '32',
      navn: 'Supplerende stønad til uføre flyktninger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '39',
            navn: 'Lov om supplerende stønad',
            beskrivelse: 'Lov om supplerande stønad ved kort butid',
          },
          registreringshjemler: [
            {
              id: 'SUP_ST_L_2',
              navn: '§ 2',
            },
            {
              id: '696',
              navn: '§ 3',
            },
            {
              id: '697',
              navn: '§ 4',
            },
            {
              id: '698',
              navn: '§ 5',
            },
            {
              id: '699',
              navn: '§ 6',
            },
            {
              id: '700',
              navn: '§ 7',
            },
            {
              id: '701',
              navn: '§ 8',
            },
            {
              id: '702',
              navn: '§ 9',
            },
            {
              id: '703',
              navn: '§ 10',
            },
            {
              id: '704',
              navn: '§ 11',
            },
            {
              id: '705',
              navn: '§ 12',
            },
            {
              id: '706',
              navn: '§ 13',
            },
            {
              id: '839',
              navn: '§ 17',
            },
            {
              id: '707',
              navn: '§ 18',
            },
            {
              id: '840',
              navn: '§ 21',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
        {
          lovkilde: {
            id: '74',
            navn: 'Grunnloven',
            beskrivelse: 'Grl',
          },
          registreringshjemler: [
            {
              id: 'GRL_97',
              navn: '§ 97',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '696',
          navn: 'Lov om supplerande stønad ved kort butid - § 3',
          beskrivelse: 'Lov om supplerende stønad - § 3',
        },
        {
          id: '697',
          navn: 'Lov om supplerande stønad ved kort butid - § 4',
          beskrivelse: 'Lov om supplerende stønad - § 4',
        },
        {
          id: '698',
          navn: 'Lov om supplerande stønad ved kort butid - § 5',
          beskrivelse: 'Lov om supplerende stønad - § 5',
        },
        {
          id: '699',
          navn: 'Lov om supplerande stønad ved kort butid - § 6',
          beskrivelse: 'Lov om supplerende stønad - § 6',
        },
        {
          id: '700',
          navn: 'Lov om supplerande stønad ved kort butid - § 7',
          beskrivelse: 'Lov om supplerende stønad - § 7',
        },
        {
          id: '701',
          navn: 'Lov om supplerande stønad ved kort butid - § 8',
          beskrivelse: 'Lov om supplerende stønad - § 8',
        },
        {
          id: '702',
          navn: 'Lov om supplerande stønad ved kort butid - § 9',
          beskrivelse: 'Lov om supplerende stønad - § 9',
        },
        {
          id: '703',
          navn: 'Lov om supplerande stønad ved kort butid - § 10',
          beskrivelse: 'Lov om supplerende stønad - § 10',
        },
        {
          id: '704',
          navn: 'Lov om supplerande stønad ved kort butid - § 11',
          beskrivelse: 'Lov om supplerende stønad - § 11',
        },
        {
          id: '705',
          navn: 'Lov om supplerande stønad ved kort butid - § 12',
          beskrivelse: 'Lov om supplerende stønad - § 12',
        },
        {
          id: '706',
          navn: 'Lov om supplerande stønad ved kort butid - § 13',
          beskrivelse: 'Lov om supplerende stønad - § 13',
        },
        {
          id: '839',
          navn: 'Lov om supplerande stønad ved kort butid - § 17',
          beskrivelse: 'Lov om supplerende stønad - § 17',
        },
        {
          id: '707',
          navn: 'Lov om supplerande stønad ved kort butid - § 18',
          beskrivelse: 'Lov om supplerende stønad - § 18',
        },
        {
          id: '840',
          navn: 'Lov om supplerande stønad ved kort butid - § 21',
          beskrivelse: 'Lov om supplerende stønad - § 21',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FVL_29',
          navn: 'Fvl - § 29',
          beskrivelse: 'Forvaltningsloven - § 29',
        },
        {
          id: 'FVL_30',
          navn: 'Fvl - § 30',
          beskrivelse: 'Forvaltningsloven - § 30',
        },
        {
          id: 'FVL_31',
          navn: 'Fvl - § 31',
          beskrivelse: 'Forvaltningsloven - § 31',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'TRRL_10',
          navn: 'Trrl - § 10',
          beskrivelse: 'Trygderettsloven - § 10',
        },
        {
          id: 'TRRL_11',
          navn: 'Trrl - § 11',
          beskrivelse: 'Trygderettsloven - § 11',
        },
      ],
    },
    {
      id: '1',
      navn: 'Sykdom i familien - Omsorgspenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '414',
              navn: '§ 8-28',
            },
            {
              id: '190',
              navn: '§ 8-30',
            },
            {
              id: '1000.009.002',
              navn: '§ 9-2',
            },
            {
              id: 'FTRL_9_3_1',
              navn: '§ 9-3 første ledd',
            },
            {
              id: 'FTRL_9_3_2',
              navn: '§ 9-3 andre ledd',
            },
            {
              id: '140',
              navn: '§ 9-4',
            },
            {
              id: '1000.009.005',
              navn: '§ 9-5',
            },
            {
              id: '153',
              navn: '§ 9-5 utvidet rett',
            },
            {
              id: '1000.009.006',
              navn: '§ 9-6',
            },
            {
              id: '154',
              navn: '§ 9-6 utvidet rett',
            },
            {
              id: '155',
              navn: '§ 9-7',
            },
            {
              id: '1000.009.008',
              navn: '§ 9-8',
            },
            {
              id: '1000.009.009',
              navn: '§ 9-9',
            },
            {
              id: 'FTRL_9_9_B_ARBEIDSTAKER',
              navn: '§ 9-9 - beregning arbeidstaker',
            },
            {
              id: 'FTRL_9_9_B_FRILANSER',
              navn: '§ 9-9 - beregning frilanser',
            },
            {
              id: 'FTRL_9_9_B_SELVSTENDIG_NAERINGSDRIVENDE',
              navn: '§ 9-9 - beregning selvstendig næringsdrivende',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '1000.022.003',
              navn: '§ 22-3',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.009.002',
          navn: 'Ftrl - § 9-2',
          beskrivelse: 'Folketrygdloven - § 9-2',
        },
        {
          id: '1000.009.003',
          navn: 'Ftrl - § 9-3',
          beskrivelse: 'Folketrygdloven - § 9-3',
        },
        {
          id: '1000.009.005',
          navn: 'Ftrl - § 9-5',
          beskrivelse: 'Folketrygdloven - § 9-5',
        },
        {
          id: '1000.009.006',
          navn: 'Ftrl - § 9-6',
          beskrivelse: 'Folketrygdloven - § 9-6',
        },
        {
          id: '1000.009.008',
          navn: 'Ftrl - § 9-8',
          beskrivelse: 'Folketrygdloven - § 9-8',
        },
        {
          id: '1000.009.009',
          navn: 'Ftrl - § 9-9',
          beskrivelse: 'Folketrygdloven - § 9-9',
        },
        {
          id: '1000.009.010',
          navn: 'Ftrl - § 9-10',
          beskrivelse: 'Folketrygdloven - § 9-10',
        },
        {
          id: '1000.009.011',
          navn: 'Ftrl - § 9-11',
          beskrivelse: 'Folketrygdloven - § 9-11',
        },
        {
          id: '1000.009.013',
          navn: 'Ftrl - § 9-13',
          beskrivelse: 'Folketrygdloven - § 9-13',
        },
        {
          id: '1000.009.014',
          navn: 'Ftrl - § 9-14',
          beskrivelse: 'Folketrygdloven - § 9-14',
        },
        {
          id: '1000.009.015',
          navn: 'Ftrl - § 9-15',
          beskrivelse: 'Folketrygdloven - § 9-15',
        },
        {
          id: '1000.009.016',
          navn: 'Ftrl - § 9-16',
          beskrivelse: 'Folketrygdloven - § 9-16',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '2',
      navn: 'Sykdom i familien - Opplæringspenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '1000.009.002',
              navn: '§ 9-2',
            },
            {
              id: 'FTRL_9_2_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-2 - midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_3_1',
              navn: '§ 9-3 første ledd',
            },
            {
              id: 'FTRL_9_3_2',
              navn: '§ 9-3 andre ledd',
            },
            {
              id: '140',
              navn: '§ 9-4',
            },
            {
              id: '1000.009.014',
              navn: '§ 9-14',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSLEDIGE',
              navn: '§ 9-15 - beregning arbeidsledige',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSTAKER',
              navn: '§ 9-15 - beregning arbeidstaker',
            },
            {
              id: 'FTRL_9_15_B_FRILANSER',
              navn: '§ 9-15 - beregning frilanser',
            },
            {
              id: 'FTRL_9_15_B_KOMBINERT',
              navn: '§ 9-15 - beregning kombinert',
            },
            {
              id: 'FTRL_9_15_B_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-15 - beregning midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_15_B_SELVSTENDIG_NAERINGSDRIVENDE',
              navn: '§ 9-15 - beregning selvstendig næringsdrivende',
            },
            {
              id: 'FTRL_9_15_GRADERING',
              navn: '§ 9-15 - gradering',
            },
            {
              id: '1000.009.016',
              navn: '§ 9-16',
            },
            {
              id: '141',
              navn: '§ 9-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '1000.022.003',
              navn: '§ 22-3',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.009.002',
          navn: 'Ftrl - § 9-2',
          beskrivelse: 'Folketrygdloven - § 9-2',
        },
        {
          id: '1000.009.003',
          navn: 'Ftrl - § 9-3',
          beskrivelse: 'Folketrygdloven - § 9-3',
        },
        {
          id: '1000.009.005',
          navn: 'Ftrl - § 9-5',
          beskrivelse: 'Folketrygdloven - § 9-5',
        },
        {
          id: '1000.009.006',
          navn: 'Ftrl - § 9-6',
          beskrivelse: 'Folketrygdloven - § 9-6',
        },
        {
          id: '1000.009.008',
          navn: 'Ftrl - § 9-8',
          beskrivelse: 'Folketrygdloven - § 9-8',
        },
        {
          id: '1000.009.009',
          navn: 'Ftrl - § 9-9',
          beskrivelse: 'Folketrygdloven - § 9-9',
        },
        {
          id: '1000.009.010',
          navn: 'Ftrl - § 9-10',
          beskrivelse: 'Folketrygdloven - § 9-10',
        },
        {
          id: '1000.009.011',
          navn: 'Ftrl - § 9-11',
          beskrivelse: 'Folketrygdloven - § 9-11',
        },
        {
          id: '1000.009.013',
          navn: 'Ftrl - § 9-13',
          beskrivelse: 'Folketrygdloven - § 9-13',
        },
        {
          id: '1000.009.014',
          navn: 'Ftrl - § 9-14',
          beskrivelse: 'Folketrygdloven - § 9-14',
        },
        {
          id: '1000.009.015',
          navn: 'Ftrl - § 9-15',
          beskrivelse: 'Folketrygdloven - § 9-15',
        },
        {
          id: '1000.009.016',
          navn: 'Ftrl - § 9-16',
          beskrivelse: 'Folketrygdloven - § 9-16',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '4',
      navn: 'Sykdom i familien - Pleiepenger i livets sluttfase',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '1000.009.002',
              navn: '§ 9-2',
            },
            {
              id: 'FTRL_9_2_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-2 - midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_3_1',
              navn: '§ 9-3 første ledd',
            },
            {
              id: 'FTRL_9_3_2',
              navn: '§ 9-3 andre ledd',
            },
            {
              id: '140',
              navn: '§ 9-4',
            },
            {
              id: '1000.009.013',
              navn: '§ 9-13',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSLEDIGE',
              navn: '§ 9-15 - beregning arbeidsledige',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSTAKER',
              navn: '§ 9-15 - beregning arbeidstaker',
            },
            {
              id: 'FTRL_9_15_B_FRILANSER',
              navn: '§ 9-15 - beregning frilanser',
            },
            {
              id: 'FTRL_9_15_B_KOMBINERT',
              navn: '§ 9-15 - beregning kombinert',
            },
            {
              id: 'FTRL_9_15_B_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-15 - beregning midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_15_B_SELVSTENDIG_NAERINGSDRIVENDE',
              navn: '§ 9-15 - beregning selvstendig næringsdrivende',
            },
            {
              id: 'FTRL_9_15_GRADERING',
              navn: '§ 9-15 - gradering',
            },
            {
              id: '1000.009.016',
              navn: '§ 9-16',
            },
            {
              id: '141',
              navn: '§ 9-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '1000.022.003',
              navn: '§ 22-3',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.009.002',
          navn: 'Ftrl - § 9-2',
          beskrivelse: 'Folketrygdloven - § 9-2',
        },
        {
          id: '1000.009.003',
          navn: 'Ftrl - § 9-3',
          beskrivelse: 'Folketrygdloven - § 9-3',
        },
        {
          id: '1000.009.005',
          navn: 'Ftrl - § 9-5',
          beskrivelse: 'Folketrygdloven - § 9-5',
        },
        {
          id: '1000.009.006',
          navn: 'Ftrl - § 9-6',
          beskrivelse: 'Folketrygdloven - § 9-6',
        },
        {
          id: '1000.009.008',
          navn: 'Ftrl - § 9-8',
          beskrivelse: 'Folketrygdloven - § 9-8',
        },
        {
          id: '1000.009.009',
          navn: 'Ftrl - § 9-9',
          beskrivelse: 'Folketrygdloven - § 9-9',
        },
        {
          id: '1000.009.010',
          navn: 'Ftrl - § 9-10',
          beskrivelse: 'Folketrygdloven - § 9-10',
        },
        {
          id: '1000.009.011',
          navn: 'Ftrl - § 9-11',
          beskrivelse: 'Folketrygdloven - § 9-11',
        },
        {
          id: '1000.009.013',
          navn: 'Ftrl - § 9-13',
          beskrivelse: 'Folketrygdloven - § 9-13',
        },
        {
          id: '1000.009.014',
          navn: 'Ftrl - § 9-14',
          beskrivelse: 'Folketrygdloven - § 9-14',
        },
        {
          id: '1000.009.015',
          navn: 'Ftrl - § 9-15',
          beskrivelse: 'Folketrygdloven - § 9-15',
        },
        {
          id: '1000.009.016',
          navn: 'Ftrl - § 9-16',
          beskrivelse: 'Folketrygdloven - § 9-16',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '3',
      navn: 'Sykdom i familien - Pleiepenger sykt barn',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '1000.008.013',
              navn: '§ 8-13',
            },
            {
              id: '1000.009.002',
              navn: '§ 9-2',
            },
            {
              id: 'FTRL_9_2_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-2 - midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_3_1',
              navn: '§ 9-3 første ledd',
            },
            {
              id: 'FTRL_9_3_2',
              navn: '§ 9-3 andre ledd',
            },
            {
              id: '140',
              navn: '§ 9-4',
            },
            {
              id: '1000.009.010',
              navn: '§ 9-10',
            },
            {
              id: '856',
              navn: '§ 9-10 over 18 år',
            },
            {
              id: '1000.009.011',
              navn: '§ 9-11',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSLEDIGE',
              navn: '§ 9-15 - beregning arbeidsledige',
            },
            {
              id: 'FTRL_9_15_B_ARBEIDSTAKER',
              navn: '§ 9-15 - beregning arbeidstaker',
            },
            {
              id: 'FTRL_9_15_B_FRILANSER',
              navn: '§ 9-15 - beregning frilanser',
            },
            {
              id: 'FTRL_9_15_B_KOMBINERT',
              navn: '§ 9-15 - beregning kombinert',
            },
            {
              id: 'FTRL_9_15_B_MIDLERTIDIG_UTE_AV_ARBEID',
              navn: '§ 9-15 - beregning midlertidig ute av arbeid',
            },
            {
              id: 'FTRL_9_15_B_SELVSTENDIG_NAERINGSDRIVENDE',
              navn: '§ 9-15 - beregning selvstendig næringsdrivende',
            },
            {
              id: 'FTRL_9_15_GRADERING',
              navn: '§ 9-15 - gradering',
            },
            {
              id: '1000.009.016',
              navn: '§ 9-16',
            },
            {
              id: '141',
              navn: '§ 9-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '1000.022.003',
              navn: '§ 22-3',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.009.002',
          navn: 'Ftrl - § 9-2',
          beskrivelse: 'Folketrygdloven - § 9-2',
        },
        {
          id: '1000.009.003',
          navn: 'Ftrl - § 9-3',
          beskrivelse: 'Folketrygdloven - § 9-3',
        },
        {
          id: '1000.009.005',
          navn: 'Ftrl - § 9-5',
          beskrivelse: 'Folketrygdloven - § 9-5',
        },
        {
          id: '1000.009.006',
          navn: 'Ftrl - § 9-6',
          beskrivelse: 'Folketrygdloven - § 9-6',
        },
        {
          id: '1000.009.008',
          navn: 'Ftrl - § 9-8',
          beskrivelse: 'Folketrygdloven - § 9-8',
        },
        {
          id: '1000.009.009',
          navn: 'Ftrl - § 9-9',
          beskrivelse: 'Folketrygdloven - § 9-9',
        },
        {
          id: '1000.009.010',
          navn: 'Ftrl - § 9-10',
          beskrivelse: 'Folketrygdloven - § 9-10',
        },
        {
          id: '1000.009.011',
          navn: 'Ftrl - § 9-11',
          beskrivelse: 'Folketrygdloven - § 9-11',
        },
        {
          id: '1000.009.013',
          navn: 'Ftrl - § 9-13',
          beskrivelse: 'Folketrygdloven - § 9-13',
        },
        {
          id: '1000.009.014',
          navn: 'Ftrl - § 9-14',
          beskrivelse: 'Folketrygdloven - § 9-14',
        },
        {
          id: '1000.009.015',
          navn: 'Ftrl - § 9-15',
          beskrivelse: 'Folketrygdloven - § 9-15',
        },
        {
          id: '1000.009.016',
          navn: 'Ftrl - § 9-16',
          beskrivelse: 'Folketrygdloven - § 9-16',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
      ],
    },
    {
      id: '5',
      navn: 'Sykepenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '156',
              navn: '§ 8-2',
            },
            {
              id: 'FTRL_8_3A',
              navn: '§ 8-3 første ledd',
            },
            {
              id: 'FTRL_8_3B',
              navn: '§ 8-3 andre ledd',
            },
            {
              id: '158',
              navn: '§ 8-4 første ledd',
            },
            {
              id: '159',
              navn: '§ 8-4 andre ledd',
            },
            {
              id: '160',
              navn: '§ 8-4 tredje ledd',
            },
            {
              id: 'FTRL_8_4D',
              navn: '§ 8-4 generell arbeidsuførhet',
            },
            {
              id: 'FTRL_8_4E',
              navn: '§ 8-4 yrkesuførhet',
            },
            {
              id: '161',
              navn: '§ 8-5',
            },
            {
              id: '162',
              navn: '§ 8-6',
            },
            {
              id: '163',
              navn: '§ 8-7',
            },
            {
              id: '164',
              navn: '§ 8-8',
            },
            {
              id: '165',
              navn: '§ 8-9',
            },
            {
              id: '166',
              navn: '§ 8-10',
            },
            {
              id: '167',
              navn: '§ 8-11',
            },
            {
              id: '168',
              navn: '§ 8-12',
            },
            {
              id: 'FTRL_8_13A',
              navn: '§ 8-13 første ledd',
            },
            {
              id: 'FTRL_8_13B',
              navn: '§ 8-13 andre ledd',
            },
            {
              id: '169',
              navn: '§ 8-14',
            },
            {
              id: '170',
              navn: '§ 8-15',
            },
            {
              id: '171',
              navn: '§ 8-16',
            },
            {
              id: '172',
              navn: '§ 8-17',
            },
            {
              id: '173',
              navn: '§ 8-18',
            },
            {
              id: '174',
              navn: '§ 8-19',
            },
            {
              id: '175',
              navn: '§ 8-20',
            },
            {
              id: '176',
              navn: '§ 8-21',
            },
            {
              id: '177',
              navn: '§ 8-22',
            },
            {
              id: '178',
              navn: '§ 8-23',
            },
            {
              id: '179',
              navn: '§ 8-24',
            },
            {
              id: '180',
              navn: '§ 8-25',
            },
            {
              id: '181',
              navn: '§ 8-26',
            },
            {
              id: '182',
              navn: '§ 8-27',
            },
            {
              id: '183',
              navn: '§ 8-28 første ledd',
            },
            {
              id: '184',
              navn: '§ 8-28 andre ledd',
            },
            {
              id: 'FTRL_8_28_3A',
              navn: '§ 8-28 tredje ledd bokstav a',
            },
            {
              id: 'FTRL_8_28_3B',
              navn: '§ 8-28 tredje ledd bokstav b',
            },
            {
              id: 'FTRL_8_28_3C',
              navn: '§ 8-28 tredje ledd bokstav c',
            },
            {
              id: '186',
              navn: '§ 8-28 fjerde ledd',
            },
            {
              id: '187',
              navn: '§ 8-28 femte ledd',
            },
            {
              id: '188',
              navn: '§ 8-28 sjette ledd',
            },
            {
              id: '189',
              navn: '§ 8-29',
            },
            {
              id: '190',
              navn: '§ 8-30',
            },
            {
              id: '191',
              navn: '§ 8-31',
            },
            {
              id: '192',
              navn: '§ 8-32',
            },
            {
              id: '193',
              navn: '§ 8-33',
            },
            {
              id: '194',
              navn: '§ 8-34',
            },
            {
              id: '195',
              navn: '§ 8-35',
            },
            {
              id: '196',
              navn: '§ 8-36',
            },
            {
              id: '197',
              navn: '§ 8-37',
            },
            {
              id: '198',
              navn: '§ 8-38',
            },
            {
              id: '199',
              navn: '§ 8-39',
            },
            {
              id: '200',
              navn: '§ 8-40',
            },
            {
              id: '201',
              navn: '§ 8-41 første ledd',
            },
            {
              id: '202',
              navn: '§ 8-41 andre ledd',
            },
            {
              id: '203',
              navn: '§ 8-42',
            },
            {
              id: '204',
              navn: '§ 8-43',
            },
            {
              id: '205',
              navn: '§ 8-44',
            },
            {
              id: '206',
              navn: '§ 8-45',
            },
            {
              id: '207',
              navn: '§ 8-46',
            },
            {
              id: '208',
              navn: '§ 8-47 første ledd',
            },
            {
              id: '209',
              navn: '§ 8-47 andre til åttende ledd',
            },
            {
              id: '210',
              navn: '§ 8-48',
            },
            {
              id: '211',
              navn: '§ 8-49',
            },
            {
              id: '212',
              navn: '§ 8-50',
            },
            {
              id: '213',
              navn: '§ 8-51',
            },
            {
              id: '214',
              navn: '§ 8-52',
            },
            {
              id: '215',
              navn: '§ 8-53',
            },
            {
              id: '216',
              navn: '§ 8-54',
            },
            {
              id: '217',
              navn: '§ 8-55',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '1000.022.003',
              navn: '§ 22-3',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '113',
              navn: '§ 22-12',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '223',
              navn: '§ 22-13 andre ledd',
            },
            {
              id: '224',
              navn: '§ 22-13 tredje ledd',
            },
            {
              id: '225',
              navn: '§ 22-13 sjette ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '227',
              navn: '§ 22-13 åttende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
            {
              id: 'ANKENEMNDA_FTRL_21_12_ARBEIDSGIVER',
              navn: 'Ankenemnda § 21-13 (arbeidsgiver)',
            },
            {
              id: 'ANKENEMNDA_FTRL_21_12_ARBEIDSTAKER',
              navn: 'Ankenemnda § 21-13 (arbeidstaker)',
            },
            {
              id: 'FTRL_2',
              navn: 'kap. 2',
            },
            {
              id: 'FTRL_8_4_PILOT_22_15',
              navn: 'Pilot § 8-4 jfr. 8-22',
            },
            {
              id: 'FTRL_8_7_PILOT',
              navn: 'Pilot § 8-7',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: '310',
              navn: 'art. 2',
            },
            {
              id: 'EOES_883_2004_4',
              navn: 'art. 4',
            },
            {
              id: 'EOES_883_2004_5',
              navn: 'art. 5',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '312',
              navn: 'art. 10',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '313',
              navn: 'art. 21',
            },
            {
              id: 'EOES_883_2004_76',
              navn: 'art. 76',
            },
            {
              id: 'EOES_883_2004_81',
              navn: 'art. 81',
            },
            {
              id: 'EOES_883_2004_82',
              navn: 'art. 82',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: 'FVL_2',
              navn: '§ 2',
            },
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: 'FVL_34',
              navn: '§ 34',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
            {
              id: 'TRRL_29',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '13',
            navn: 'Forskrift Covid-19',
            beskrivelse: 'Covid-19-forskriften',
          },
          registreringshjemler: [
            {
              id: '816',
              navn: '§ 1-2',
            },
            {
              id: '817',
              navn: '§ 1-3',
            },
            {
              id: '818',
              navn: '§ 3-1',
            },
            {
              id: 'FS_COV_19_3_4',
              navn: '§ 3-4',
            },
            {
              id: 'FS_COV_19_3_5',
              navn: '§ 3-5',
            },
            {
              id: 'FS_COV_19_3_6',
              navn: '§ 3-6',
            },
            {
              id: '819',
              navn: '§ 3A-1',
            },
            {
              id: 'FS_COV_19_3A_2',
              navn: '§ 3A-2',
            },
            {
              id: '820',
              navn: '§ 3A-3',
            },
            {
              id: 'FS_COV_19_3A_4',
              navn: '§ 3A-4',
            },
          ],
        },
        {
          lovkilde: {
            id: '61',
            navn: 'Brexitavtalen',
            beskrivelse: 'Brexitavtalen',
          },
          registreringshjemler: [
            {
              id: 'BREXITAVTALEN',
              navn: 'Brexitavtalen',
            },
          ],
        },
        {
          lovkilde: {
            id: '16',
            navn: 'Gjennomføringsforordning 987/2009',
            beskrivelse: 'Gjennomføringsforordning 987/2009',
          },
          registreringshjemler: [
            {
              id: 'GJ_F_FORD_987_2009_27',
              navn: 'art. 27',
            },
            {
              id: 'GJ_F_FORD_987_2009_87',
              navn: 'art. 87',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4401',
          navn: 'Nav Arbeid og ytelser Sarpsborg',
        },
        {
          id: '4402',
          navn: 'Nav Arbeid og ytelser Romerike',
        },
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4405',
          navn: 'Nav Arbeid og ytelser Innlandet',
        },
        {
          id: '4407',
          navn: 'Nav Arbeid og ytelser Tønsberg',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4418',
          navn: 'Nav Arbeid og ytelser Fauske',
        },
        {
          id: '4473',
          navn: 'Nav AY Inntektskompensasjon',
        },
        {
          id: '4474',
          navn: 'Sykepenger Utland',
        },
        {
          id: '4411',
          navn: 'Nav Arbeid og ytelser Karmøy',
        },
        {
          id: '4415',
          navn: 'Nav Arbeid og ytelser Molde',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '0101',
          navn: 'Nav Halden-Aremark',
        },
        {
          id: '0104',
          navn: 'Nav Moss',
        },
        {
          id: '0105',
          navn: 'Nav Sarpsborg',
        },
        {
          id: '0106',
          navn: 'Nav Fredrikstad',
        },
        {
          id: '0111',
          navn: 'Nav Hvaler',
        },
        {
          id: '0119',
          navn: 'Nav Skiptvet Marker',
        },
        {
          id: '0124',
          navn: 'Nav Indre Østfold',
        },
        {
          id: '0127',
          navn: 'Nav Skiptvet',
        },
        {
          id: '0128',
          navn: 'Nav Rakkestad',
        },
        {
          id: '0135',
          navn: 'Nav Råde',
        },
        {
          id: '1037',
          navn: 'Nav Lister',
        },
        {
          id: '0211',
          navn: 'Nav Vestby',
        },
        {
          id: '0213',
          navn: 'Nav Nordre Follo',
        },
        {
          id: '0214',
          navn: 'Nav Ås',
        },
        {
          id: '0215',
          navn: 'Nav Frogn',
        },
        {
          id: '0219',
          navn: 'Nav Bærum',
        },
        {
          id: '0220',
          navn: 'Nav Asker',
        },
        {
          id: '0221',
          navn: 'Nav Aurskog-Høland',
        },
        {
          id: '0228',
          navn: 'Nav Rælingen',
        },
        {
          id: '0229',
          navn: 'Nav Enebakk',
        },
        {
          id: '0230',
          navn: 'Nav Lørenskog',
        },
        {
          id: '0231',
          navn: 'Nav Lillestrøm',
        },
        {
          id: '0233',
          navn: 'Nav Nittedal',
        },
        {
          id: '0234',
          navn: 'Nav Gjerdrum',
        },
        {
          id: '0235',
          navn: 'Nav Ullensaker',
        },
        {
          id: '0236',
          navn: 'Nav Nes i Akershus',
        },
        {
          id: '0237',
          navn: 'Nav Eidsvoll',
        },
        {
          id: '0238',
          navn: 'Nav Nannestad Gjerdrum',
        },
        {
          id: '0239',
          navn: 'Nav Hurdal',
        },
        {
          id: '0283',
          navn: 'Nav egne ansatte Øst-Viken',
        },
        {
          id: '0312',
          navn: 'Nav Frogner',
        },
        {
          id: '0313',
          navn: 'Nav St. Hanshaugen',
        },
        {
          id: '0314',
          navn: 'Nav Sagene',
        },
        {
          id: '0315',
          navn: 'Nav Grünerløkka',
        },
        {
          id: '0316',
          navn: 'Nav Gamle Oslo',
        },
        {
          id: '0318',
          navn: 'Nav Nordstrand',
        },
        {
          id: '0319',
          navn: 'Nav Søndre Nordstrand',
        },
        {
          id: '0321',
          navn: 'Nav Østensjø',
        },
        {
          id: '0326',
          navn: 'Nav Alna',
        },
        {
          id: '0327',
          navn: 'Nav Stovner',
        },
        {
          id: '0328',
          navn: 'Nav Grorud',
        },
        {
          id: '0330',
          navn: 'Nav Bjerke',
        },
        {
          id: '0331',
          navn: 'Nav Nordre Aker',
        },
        {
          id: '0334',
          navn: 'Nav Vestre Aker',
        },
        {
          id: '0383',
          navn: 'Nav egne ansatte Oslo',
        },
        {
          id: '0402',
          navn: 'Nav Kongsvinger',
        },
        {
          id: '0403',
          navn: 'Nav Hamar',
        },
        {
          id: '0412',
          navn: 'Nav Ringsaker',
        },
        {
          id: '0415',
          navn: 'Nav Løten',
        },
        {
          id: '0417',
          navn: 'Nav Stange',
        },
        {
          id: '0418',
          navn: 'Nav Nord-Odal',
        },
        {
          id: '0420',
          navn: 'Nav Eidskog',
        },
        {
          id: '0423',
          navn: 'Nav Grue',
        },
        {
          id: '0425',
          navn: 'Nav Åsnes',
        },
        {
          id: '0426',
          navn: 'Nav Våler i Hedmark',
        },
        {
          id: '0427',
          navn: 'Nav Elverum',
        },
        {
          id: '0428',
          navn: 'Nav Trysil',
        },
        {
          id: '0429',
          navn: 'Nav Åmot',
        },
        {
          id: '0430',
          navn: 'Nav Stor-Elvdal',
        },
        {
          id: '0434',
          navn: 'Nav Engerdal',
        },
        {
          id: '0437',
          navn: 'Nav Nord-Østerdal',
        },
        {
          id: '0439',
          navn: 'Nav Folldal',
        },
        {
          id: '0450',
          navn: 'ENHET FOR ARBEIDSGIVER- OG ARBEIDSTAKERREGISTERET',
        },
        {
          id: '0483',
          navn: 'Nav egne ansatte Innlandet',
        },
        {
          id: '0501',
          navn: 'Nav Lillehammer-Gausdal',
        },
        {
          id: '0502',
          navn: 'Nav Gjøvik',
        },
        {
          id: '0511',
          navn: 'Nav Lesja - Dovre',
        },
        {
          id: '0513',
          navn: 'Nav Lom-Skjåk',
        },
        {
          id: '0515',
          navn: 'Nav Vågå',
        },
        {
          id: '0516',
          navn: 'Nav Midt-Gudbrandsdal',
        },
        {
          id: '0517',
          navn: 'Nav Sel',
        },
        {
          id: '0519',
          navn: 'Nav Sør-Fron',
        },
        {
          id: '0521',
          navn: 'Nav Øyer',
        },
        {
          id: '0528',
          navn: 'Nav Østre Toten',
        },
        {
          id: '0529',
          navn: 'Nav Vestre Toten',
        },
        {
          id: '0532',
          navn: 'Nav Jevnaker',
        },
        {
          id: '0534',
          navn: 'Nav Hadeland',
        },
        {
          id: '0536',
          navn: 'Nav Søndre Land',
        },
        {
          id: '0538',
          navn: 'Nav Nordre Land',
        },
        {
          id: '0542',
          navn: 'Nav Valdres',
        },
        {
          id: '0602',
          navn: 'Nav Drammen',
        },
        {
          id: '0604',
          navn: 'Nav Kongsberg',
        },
        {
          id: '0605',
          navn: 'Nav Ringerike',
        },
        {
          id: '0612',
          navn: 'Nav Hole',
        },
        {
          id: '0617',
          navn: 'Nav Hallingdal',
        },
        {
          id: '0621',
          navn: 'Nav Sigdal',
        },
        {
          id: '0622',
          navn: 'Nav Krødsherad',
        },
        {
          id: '0623',
          navn: 'Nav Midt-Buskerud',
        },
        {
          id: '0624',
          navn: 'Nav Øvre Eiker',
        },
        {
          id: '0626',
          navn: 'Nav Lier',
        },
        {
          id: '0632',
          navn: 'Nav Numedal',
        },
        {
          id: '0683',
          navn: 'Nav egne ansatte Vest-Viken',
        },
        {
          id: '0701',
          navn: 'Nav Horten',
        },
        {
          id: '0704',
          navn: 'Nav Tønsberg',
        },
        {
          id: '0710',
          navn: 'Nav Sandefjord',
        },
        {
          id: '5301',
          navn: 'Nav Holmestrand',
        },
        {
          id: '5303',
          navn: 'Nav Larvik',
        },
        {
          id: '5302',
          navn: 'Nav Færder',
        },
        {
          id: '0805',
          navn: 'Nav Porsgrunn',
        },
        {
          id: '0806',
          navn: 'Nav Skien',
        },
        {
          id: '0811',
          navn: 'Nav Siljan',
        },
        {
          id: '0814',
          navn: 'Nav Bamble',
        },
        {
          id: '0815',
          navn: 'Nav Kragerø',
        },
        {
          id: '0817',
          navn: 'Nav Drangedal',
        },
        {
          id: '0821',
          navn: 'Nav Midt-Telemark',
        },
        {
          id: '0826',
          navn: 'Nav Tinn',
        },
        {
          id: '0833',
          navn: 'Nav Vest-Telemark',
        },
        {
          id: '0883',
          navn: 'Nav egne ansatte Vestfold og Telemark',
        },
        {
          id: '0904',
          navn: 'Nav Grimstad',
        },
        {
          id: '0906',
          navn: 'Nav Arendal',
        },
        {
          id: '0901',
          navn: 'Nav Risør',
        },
        {
          id: '0911',
          navn: 'Nav Gjerstad',
        },
        {
          id: '0914',
          navn: 'Nav Øst i Agder',
        },
        {
          id: '0919',
          navn: 'Nav Froland',
        },
        {
          id: '0928',
          navn: 'Nav Birkenes',
        },
        {
          id: '0929',
          navn: 'Nav Åmli',
        },
        {
          id: '0937',
          navn: 'Nav Evje og Hornnes',
        },
        {
          id: '0926',
          navn: 'Nav Lillesand',
        },
        {
          id: '1001',
          navn: 'Nav Kristiansand',
        },
        {
          id: '1002',
          navn: 'Nav Lindesnes',
        },
        {
          id: '1014',
          navn: 'Nav Midt-Agder',
        },
        {
          id: '1004',
          navn: 'Nav Flekkefjord',
        },
        {
          id: '1032',
          navn: 'Nav Lyngdal',
        },
        {
          id: '1034',
          navn: 'Nav Hægebostad',
        },
        {
          id: '1046',
          navn: 'Nav Sirdal',
        },
        {
          id: '1083',
          navn: 'Nav egne ansatte Agder',
        },
        {
          id: '1101',
          navn: 'Nav Dalane',
        },
        {
          id: '1102',
          navn: 'Nav Sandnes',
        },
        {
          id: '1106',
          navn: 'Nav Haugesund-Utsira',
        },
        {
          id: '1111',
          navn: 'Nav Sokndal',
        },
        {
          id: '1112',
          navn: 'Nav Lund',
        },
        {
          id: '1119',
          navn: 'Nav Hå',
        },
        {
          id: '1120',
          navn: 'Nav Klepp-Time',
        },
        {
          id: '1122',
          navn: 'Nav Gjesdal',
        },
        {
          id: '1124',
          navn: 'Nav Sola',
        },
        {
          id: '1127',
          navn: 'Nav Randaberg-Kvitsøy',
        },
        {
          id: '1130',
          navn: 'Nav Strand',
        },
        {
          id: '1133',
          navn: 'Nav Hjelmeland',
        },
        {
          id: '1134',
          navn: 'Nav Suldal',
        },
        {
          id: '1135',
          navn: 'Nav Sauda',
        },
        {
          id: '1146',
          navn: 'Nav Tysvær',
        },
        {
          id: '1149',
          navn: 'Nav Karmøy-Bokn',
        },
        {
          id: '1160',
          navn: 'Nav Vindafjord-Etne',
        },
        {
          id: '1161',
          navn: 'Nav Eiganes og Tasta',
        },
        {
          id: '1162',
          navn: 'Nav Hundvåg og Storhaug',
        },
        {
          id: '1164',
          navn: 'Nav Hillevåg og Hinna',
        },
        {
          id: '1165',
          navn: 'Nav Madla',
        },
        {
          id: '1169',
          navn: 'Nav Rennesøy og Finnøy',
        },
        {
          id: '1183',
          navn: 'Nav egne ansatte Rogaland',
        },
        {
          id: '1202',
          navn: 'Nav Bergen sør',
        },
        {
          id: '1203',
          navn: 'Nav Bergen nord',
        },
        {
          id: '1204',
          navn: 'Nav Arna',
        },
        {
          id: '1205',
          navn: 'Nav Fyllingsdalen',
        },
        {
          id: '1206',
          navn: 'Nav Bergen vest',
        },
        {
          id: '1208',
          navn: 'Nav Årstad',
        },
        {
          id: '1209',
          navn: 'Nav Bergenhus',
        },
        {
          id: '1210',
          navn: 'Nav Ytrebygda',
        },
        {
          id: '1211',
          navn: 'Nav Etne',
        },
        {
          id: '1216',
          navn: 'Nav Sveio',
        },
        {
          id: '1219',
          navn: 'Nav Bømlo',
        },
        {
          id: '1221',
          navn: 'Nav Stord',
        },
        {
          id: '1222',
          navn: 'Nav Fitjar',
        },
        {
          id: '1223',
          navn: 'Nav Tysnes',
        },
        {
          id: '1224',
          navn: 'Nav Kvinnherad',
        },
        {
          id: '1228',
          navn: 'Nav Ullensvang',
        },
        {
          id: '1232',
          navn: 'Nav Eidfjord',
        },
        {
          id: '1233',
          navn: 'Nav Ulvik',
        },
        {
          id: '1235',
          navn: 'Nav Voss',
        },
        {
          id: '1238',
          navn: 'Nav Kvam',
        },
        {
          id: '1242',
          navn: 'Nav Samnanger',
        },
        {
          id: '1243',
          navn: 'Nav Bjørnafjorden',
        },
        {
          id: '1244',
          navn: 'Nav Austevoll',
        },
        {
          id: '1246',
          navn: 'Nav Øygarden',
        },
        {
          id: '1247',
          navn: 'Nav Askøy',
        },
        {
          id: '1251',
          navn: 'Nav Vaksdal',
        },
        {
          id: '1253',
          navn: 'Nav Osterøy',
        },
        {
          id: '1263',
          navn: 'Nav Alver',
        },
        {
          id: '1266',
          navn: 'Nav Fensfjorden',
        },
        {
          id: '1283',
          navn: 'Nav egne ansatte Vestland',
        },
        {
          id: '1401',
          navn: 'Nav Kinn',
        },
        {
          id: '1412',
          navn: 'Nav Solund',
        },
        {
          id: '1413',
          navn: 'Nav Hyllestad',
        },
        {
          id: '1416',
          navn: 'Nav Høyanger',
        },
        {
          id: '1417',
          navn: 'Nav Vik',
        },
        {
          id: '1420',
          navn: 'Nav Sogndal',
        },
        {
          id: '1421',
          navn: 'Nav Aurland',
        },
        {
          id: '1422',
          navn: 'Nav Lærdal',
        },
        {
          id: '1424',
          navn: 'Nav Årdal',
        },
        {
          id: '1426',
          navn: 'Nav Luster',
        },
        {
          id: '1428',
          navn: 'Nav Askvoll',
        },
        {
          id: '1429',
          navn: 'Nav Fjaler',
        },
        {
          id: '1432',
          navn: 'Nav Sunnfjord',
        },
        {
          id: '1438',
          navn: 'Nav Bremanger',
        },
        {
          id: '1443',
          navn: 'Nav Stad',
        },
        {
          id: '1445',
          navn: 'Nav Gloppen',
        },
        {
          id: '1449',
          navn: 'Nav Stryn',
        },
        {
          id: '1502',
          navn: 'Nav Molde',
        },
        {
          id: '1504',
          navn: 'Nav Ålesund',
        },
        {
          id: '1505',
          navn: 'Nav Kristiansund',
        },
        {
          id: '1515',
          navn: 'Nav Herøy og Vanylven',
        },
        {
          id: '1517',
          navn: 'Nav Hareid - Ulstein - Sande',
        },
        {
          id: '1520',
          navn: 'Nav Ørsta Volda',
        },
        {
          id: '1525',
          navn: 'Nav Stranda',
        },
        {
          id: '1528',
          navn: 'Nav Sykkylven - Stranda',
        },
        {
          id: '1529',
          navn: 'Nav Fjord',
        },
        {
          id: '1531',
          navn: 'Nav Sula',
        },
        {
          id: '1532',
          navn: 'Nav Giske',
        },
        {
          id: '1535',
          navn: 'Nav Vestnes',
        },
        {
          id: '1539',
          navn: 'Nav Rauma',
        },
        {
          id: '1547',
          navn: 'Nav Aukra',
        },
        {
          id: '1548',
          navn: 'Nav Hustadvika',
        },
        {
          id: '1554',
          navn: 'Nav Averøy',
        },
        {
          id: '1557',
          navn: 'Nav Gjemnes',
        },
        {
          id: '1560',
          navn: 'Nav Tingvoll',
        },
        {
          id: '1563',
          navn: 'Nav Indre Nordmøre',
        },
        {
          id: '1566',
          navn: 'Nav Surnadal',
        },
        {
          id: '1567',
          navn: 'Nav Rindal',
        },
        {
          id: '1572',
          navn: 'Nav Tustna',
        },
        {
          id: '1573',
          navn: 'Nav Smøla',
        },
        {
          id: '1576',
          navn: 'Nav Aure',
        },
        {
          id: '1583',
          navn: 'Nav egne ansatte Møre og Romsdal',
        },
        {
          id: '1607',
          navn: 'Nav Heimdal',
        },
        {
          id: '1612',
          navn: 'Nav Heim',
        },
        {
          id: '1620',
          navn: 'Nav Hitra Frøya',
        },
        {
          id: '1621',
          navn: 'Nav Ørland',
        },
        {
          id: '1624',
          navn: 'Nav Rissa',
        },
        {
          id: '1627',
          navn: 'Nav Bjugn',
        },
        {
          id: '1630',
          navn: 'Nav Nord-Fosen',
        },
        {
          id: '1634',
          navn: 'Nav Oppdal og Rennebu',
        },
        {
          id: '1638',
          navn: 'Nav Orkland',
        },
        {
          id: '1640',
          navn: 'Nav Røros, Os og Holtålen',
        },
        {
          id: '1644',
          navn: 'Nav Holtålen',
        },
        {
          id: '1648',
          navn: 'Nav Midtre Gauldal',
        },
        {
          id: '1653',
          navn: 'Nav Melhus',
        },
        {
          id: '1657',
          navn: 'Nav Skaun',
        },
        {
          id: '1663',
          navn: 'Nav Malvik',
        },
        {
          id: '1683',
          navn: 'Nav egne ansatte Trøndelag',
        },
        {
          id: '1702',
          navn: 'Nav Inn-Trøndelag',
        },
        {
          id: '1703',
          navn: 'Nav Midtre Namdal',
        },
        {
          id: '1718',
          navn: 'Nav Leksvik',
        },
        {
          id: '1719',
          navn: 'Nav Levanger',
        },
        {
          id: '1721',
          navn: 'Nav Verdal',
        },
        {
          id: '1724',
          navn: 'Nav Verran',
        },
        {
          id: '1725',
          navn: 'Nav Namdalseid',
        },
        {
          id: '1729',
          navn: 'Avviklet - Nav Inderøy',
        },
        {
          id: '1736',
          navn: 'Nav Snåsa',
        },
        {
          id: '1738',
          navn: 'Nav Lierne',
        },
        {
          id: '1739',
          navn: 'Nav Røyrvik',
        },
        {
          id: '1740',
          navn: 'Nav Namsskogan',
        },
        {
          id: '1742',
          navn: 'Nav Indre Namdal',
        },
        {
          id: '1743',
          navn: 'Nav Høylandet',
        },
        {
          id: '1744',
          navn: 'Nav Overhalla',
        },
        {
          id: '1748',
          navn: 'Nav Fosnes',
        },
        {
          id: '1749',
          navn: 'Nav Flatanger',
        },
        {
          id: '1750',
          navn: 'Nav Vikna',
        },
        {
          id: '1751',
          navn: 'Nav Nærøysund',
        },
        {
          id: '1755',
          navn: 'Nav Leka',
        },
        {
          id: '1756',
          navn: 'Nav Inderøy',
        },
        {
          id: '1804',
          navn: 'Nav Bodø',
        },
        {
          id: '1805',
          navn: 'Nav Narvik',
        },
        {
          id: '1812',
          navn: 'Nav Sømna',
        },
        {
          id: '1813',
          navn: 'Nav Sør-Helgeland',
        },
        {
          id: '1815',
          navn: 'Nav Vega',
        },
        {
          id: '1816',
          navn: 'Nav Vevelstad',
        },
        {
          id: '1818',
          navn: 'Nav Herøy',
        },
        {
          id: '1820',
          navn: 'Nav Ytre Helgeland',
        },
        {
          id: '1822',
          navn: 'Nav Leirfjord',
        },
        {
          id: '1824',
          navn: 'Nav Vefsna',
        },
        {
          id: '1825',
          navn: 'Nav Grane',
        },
        {
          id: '1826',
          navn: 'Nav Hattfjelldal',
        },
        {
          id: '1827',
          navn: 'Nav Dønna',
        },
        {
          id: '1828',
          navn: 'Nav Nesna',
        },
        {
          id: '1832',
          navn: 'Nav Hemnes',
        },
        {
          id: '1833',
          navn: 'Nav Rana',
        },
        {
          id: '1834',
          navn: 'Nav Lurøy',
        },
        {
          id: '1835',
          navn: 'Nav Træna',
        },
        {
          id: '1836',
          navn: 'Nav Rødøy',
        },
        {
          id: '1837',
          navn: 'Nav Meløy',
        },
        {
          id: '1838',
          navn: 'Nav Gildeskål',
        },
        {
          id: '1839',
          navn: 'Nav Beiarn',
        },
        {
          id: '1840',
          navn: 'Nav Saltdal',
        },
        {
          id: '1841',
          navn: 'Nav Indre Salten',
        },
        {
          id: '1845',
          navn: 'Nav Sørfold',
        },
        {
          id: '1848',
          navn: 'Nav Steigen',
        },
        {
          id: '1849',
          navn: 'Nav Hamarøy',
        },
        {
          id: '1850',
          navn: 'Nav Tysfjord',
        },
        {
          id: '1851',
          navn: 'Nav Lødingen',
        },
        {
          id: '1852',
          navn: 'Nav Evenes og Tjeldsund',
        },
        {
          id: '1854',
          navn: 'Nav Ballangen',
        },
        {
          id: '1856',
          navn: 'Nav Røst',
        },
        {
          id: '1857',
          navn: 'Nav Værøy',
        },
        {
          id: '1859',
          navn: 'Nav Flakstad',
        },
        {
          id: '1860',
          navn: 'Nav Lofoten',
        },
        {
          id: '1865',
          navn: 'Nav Svolvær',
        },
        {
          id: '1866',
          navn: 'Nav Hadsel',
        },
        {
          id: '1867',
          navn: 'Nav Bø',
        },
        {
          id: '1868',
          navn: 'Nav Øksnes',
        },
        {
          id: '1870',
          navn: 'Nav Sortland',
        },
        {
          id: '1871',
          navn: 'Nav Andøy',
        },
        {
          id: '1874',
          navn: 'Nav Moskenes',
        },
        {
          id: '1883',
          navn: 'Nav egne ansatte Nordland',
        },
        {
          id: '1902',
          navn: 'Nav Tromsø',
        },
        {
          id: '1903',
          navn: 'Nav Sør-Troms',
        },
        {
          id: '1911',
          navn: 'Nav Kvæfjord',
        },
        {
          id: '1913',
          navn: 'Nav Tjeldsund',
        },
        {
          id: '1917',
          navn: 'Nav Ibestad',
        },
        {
          id: '1919',
          navn: 'Nav Gratangen',
        },
        {
          id: '1920',
          navn: 'Nav Lavangen',
        },
        {
          id: '1922',
          navn: 'Nav Bardu',
        },
        {
          id: '1923',
          navn: 'Nav Salangen-Lavangen-Dyrøy',
        },
        {
          id: '1924',
          navn: 'Nav Målselv-Bardu',
        },
        {
          id: '1925',
          navn: 'Nav Sørreisa',
        },
        {
          id: '1926',
          navn: 'Nav Dyrøy',
        },
        {
          id: '1927',
          navn: 'Nav Tranøy',
        },
        {
          id: '1928',
          navn: 'Nav Torsken',
        },
        {
          id: '1929',
          navn: 'Nav Berg',
        },
        {
          id: '1931',
          navn: 'Nav Senja-Sørreisa',
        },
        {
          id: '1933',
          navn: 'Nav Balsfjord-Storfjord',
        },
        {
          id: '1936',
          navn: 'Nav Karlsøy',
        },
        {
          id: '1938',
          navn: 'Nav Lyngen',
        },
        {
          id: '1939',
          navn: 'Nav Storfjord',
        },
        {
          id: '1940',
          navn: 'Nav Gáivuotna/Kåfjord',
        },
        {
          id: '1941',
          navn: 'Nav Skjervøy',
        },
        {
          id: '1942',
          navn: 'Nav Nordreisa',
        },
        {
          id: '1943',
          navn: 'Nav Kvænangen',
        },
        {
          id: '1983',
          navn: 'Nav egne ansatte Troms og Finnmark',
        },
        {
          id: '2002',
          navn: 'Nav Vardø',
        },
        {
          id: '2003',
          navn: 'Nav Vadsø',
        },
        {
          id: '2004',
          navn: 'Nav Hammerfest-Måsøy',
        },
        {
          id: '2011',
          navn: 'Nav Guovdageaidnu/Kautokeino',
        },
        {
          id: '2012',
          navn: 'Nav Alta-Kvænangen-Loppa',
        },
        {
          id: '2014',
          navn: 'Nav Loppa',
        },
        {
          id: '2015',
          navn: 'Nav Hasvik',
        },
        {
          id: '2017',
          navn: 'Nav Kvalsund',
        },
        {
          id: '2018',
          navn: 'Nav Måsøy',
        },
        {
          id: '2019',
          navn: 'Nav Nordkapp',
        },
        {
          id: '2020',
          navn: 'Nav Porsanger',
        },
        {
          id: '2021',
          navn: 'Nav Karasjohka/Karasjok',
        },
        {
          id: '2022',
          navn: 'Nav Lebesby',
        },
        {
          id: '2023',
          navn: 'Nav Gamvik',
        },
        {
          id: '2024',
          navn: 'Nav Berlevåg',
        },
        {
          id: '2025',
          navn: 'Nav Deatnu/Tana',
        },
        {
          id: '2027',
          navn: 'Nav Unjárga/Nesseby',
        },
        {
          id: '2028',
          navn: 'Nav Båtsfjord',
        },
        {
          id: '2030',
          navn: 'Nav Sør-Varanger',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
        {
          id: '5702',
          navn: 'Nav Lerkendal',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: '1000.008.001',
          navn: 'Ftrl - § 8-1',
          beskrivelse: 'Folketrygdloven - § 8-1',
        },
        {
          id: '1000.008.002',
          navn: 'Ftrl - § 8-2',
          beskrivelse: 'Folketrygdloven - § 8-2',
        },
        {
          id: '1000.008.003',
          navn: 'Ftrl - § 8-3',
          beskrivelse: 'Folketrygdloven - § 8-3',
        },
        {
          id: '1000.008.004',
          navn: 'Ftrl - § 8-4',
          beskrivelse: 'Folketrygdloven - § 8-4',
        },
        {
          id: 'FTRL_8_4_PILOT_22_15',
          navn: 'Ftrl - Pilot § 8-4 jfr. 8-22',
          beskrivelse: 'Folketrygdloven - Pilot § 8-4 jfr. 8-22',
        },
        {
          id: '1000.008.005',
          navn: 'Ftrl - § 8-5',
          beskrivelse: 'Folketrygdloven - § 8-5',
        },
        {
          id: '1000.008.006',
          navn: 'Ftrl - § 8-6',
          beskrivelse: 'Folketrygdloven - § 8-6',
        },
        {
          id: '1000.008.007',
          navn: 'Ftrl - § 8-7',
          beskrivelse: 'Folketrygdloven - § 8-7',
        },
        {
          id: 'FTRL_8_7_PILOT',
          navn: 'Ftrl - Pilot § 8-7',
          beskrivelse: 'Folketrygdloven - Pilot § 8-7',
        },
        {
          id: '1000.008.008',
          navn: 'Ftrl - § 8-8',
          beskrivelse: 'Folketrygdloven - § 8-8',
        },
        {
          id: '1000.008.009',
          navn: 'Ftrl - § 8-9',
          beskrivelse: 'Folketrygdloven - § 8-9',
        },
        {
          id: '1000.008.010',
          navn: 'Ftrl - § 8-10',
          beskrivelse: 'Folketrygdloven - § 8-10',
        },
        {
          id: '1000.008.011',
          navn: 'Ftrl - § 8-11',
          beskrivelse: 'Folketrygdloven - § 8-11',
        },
        {
          id: '1000.008.012',
          navn: 'Ftrl - § 8-12',
          beskrivelse: 'Folketrygdloven - § 8-12',
        },
        {
          id: '1000.008.013',
          navn: 'Ftrl - § 8-13',
          beskrivelse: 'Folketrygdloven - § 8-13',
        },
        {
          id: '1000.008.014',
          navn: 'Ftrl - § 8-14',
          beskrivelse: 'Folketrygdloven - § 8-14',
        },
        {
          id: '1000.008.015',
          navn: 'Ftrl - § 8-15',
          beskrivelse: 'Folketrygdloven - § 8-15',
        },
        {
          id: '1000.008.016',
          navn: 'Ftrl - § 8-16',
          beskrivelse: 'Folketrygdloven - § 8-16',
        },
        {
          id: '1000.008.017',
          navn: 'Ftrl - § 8-17',
          beskrivelse: 'Folketrygdloven - § 8-17',
        },
        {
          id: '1000.008.018',
          navn: 'Ftrl - § 8-18',
          beskrivelse: 'Folketrygdloven - § 8-18',
        },
        {
          id: '1000.008.019',
          navn: 'Ftrl - § 8-19',
          beskrivelse: 'Folketrygdloven - § 8-19',
        },
        {
          id: '1000.008.020',
          navn: 'Ftrl - § 8-20',
          beskrivelse: 'Folketrygdloven - § 8-20',
        },
        {
          id: '1000.008.021',
          navn: 'Ftrl - § 8-21',
          beskrivelse: 'Folketrygdloven - § 8-21',
        },
        {
          id: '1000.008.022',
          navn: 'Ftrl - § 8-22',
          beskrivelse: 'Folketrygdloven - § 8-22',
        },
        {
          id: '1000.008.023',
          navn: 'Ftrl - § 8-23',
          beskrivelse: 'Folketrygdloven - § 8-23',
        },
        {
          id: '1000.008.024',
          navn: 'Ftrl - § 8-24',
          beskrivelse: 'Folketrygdloven - § 8-24',
        },
        {
          id: '1000.008.025',
          navn: 'Ftrl - § 8-25',
          beskrivelse: 'Folketrygdloven - § 8-25',
        },
        {
          id: '1000.008.026',
          navn: 'Ftrl - § 8-26',
          beskrivelse: 'Folketrygdloven - § 8-26',
        },
        {
          id: '1000.008.027',
          navn: 'Ftrl - § 8-27',
          beskrivelse: 'Folketrygdloven - § 8-27',
        },
        {
          id: '1000.008.028',
          navn: 'Ftrl - § 8-28',
          beskrivelse: 'Folketrygdloven - § 8-28',
        },
        {
          id: '1000.008.029',
          navn: 'Ftrl - § 8-29',
          beskrivelse: 'Folketrygdloven - § 8-29',
        },
        {
          id: '1000.008.030',
          navn: 'Ftrl - § 8-30',
          beskrivelse: 'Folketrygdloven - § 8-30',
        },
        {
          id: '1000.008.031',
          navn: 'Ftrl - § 8-31',
          beskrivelse: 'Folketrygdloven - § 8-31',
        },
        {
          id: '1000.008.032',
          navn: 'Ftrl - § 8-32',
          beskrivelse: 'Folketrygdloven - § 8-32',
        },
        {
          id: '1000.008.033',
          navn: 'Ftrl - § 8-33',
          beskrivelse: 'Folketrygdloven - § 8-33',
        },
        {
          id: '1000.008.034',
          navn: 'Ftrl - § 8-34',
          beskrivelse: 'Folketrygdloven - § 8-34',
        },
        {
          id: '1000.008.035',
          navn: 'Ftrl - § 8-35',
          beskrivelse: 'Folketrygdloven - § 8-35',
        },
        {
          id: '1000.008.036',
          navn: 'Ftrl - § 8-36',
          beskrivelse: 'Folketrygdloven - § 8-36',
        },
        {
          id: '1000.008.037',
          navn: 'Ftrl - § 8-37',
          beskrivelse: 'Folketrygdloven - § 8-37',
        },
        {
          id: '1000.008.038',
          navn: 'Ftrl - § 8-38',
          beskrivelse: 'Folketrygdloven - § 8-38',
        },
        {
          id: '1000.008.039',
          navn: 'Ftrl - § 8-39',
          beskrivelse: 'Folketrygdloven - § 8-39',
        },
        {
          id: '1000.008.040',
          navn: 'Ftrl - § 8-40',
          beskrivelse: 'Folketrygdloven - § 8-40',
        },
        {
          id: '1000.008.041',
          navn: 'Ftrl - § 8-41',
          beskrivelse: 'Folketrygdloven - § 8-41',
        },
        {
          id: '1000.008.042',
          navn: 'Ftrl - § 8-42',
          beskrivelse: 'Folketrygdloven - § 8-42',
        },
        {
          id: '1000.008.043',
          navn: 'Ftrl - § 8-43',
          beskrivelse: 'Folketrygdloven - § 8-43',
        },
        {
          id: '1000.008.044',
          navn: 'Ftrl - § 8-44',
          beskrivelse: 'Folketrygdloven - § 8-44',
        },
        {
          id: '1000.008.045',
          navn: 'Ftrl - § 8-45',
          beskrivelse: 'Folketrygdloven - § 8-45',
        },
        {
          id: '1000.008.046',
          navn: 'Ftrl - § 8-46',
          beskrivelse: 'Folketrygdloven - § 8-46',
        },
        {
          id: '1000.008.047',
          navn: 'Ftrl - § 8-47',
          beskrivelse: 'Folketrygdloven - § 8-47',
        },
        {
          id: '1000.008.048',
          navn: 'Ftrl - § 8-48',
          beskrivelse: 'Folketrygdloven - § 8-48',
        },
        {
          id: '1000.008.049',
          navn: 'Ftrl - § 8-49',
          beskrivelse: 'Folketrygdloven - § 8-49',
        },
        {
          id: '1000.008.050',
          navn: 'Ftrl - § 8-50',
          beskrivelse: 'Folketrygdloven - § 8-50',
        },
        {
          id: '1000.008.051',
          navn: 'Ftrl - § 8-51',
          beskrivelse: 'Folketrygdloven - § 8-51',
        },
        {
          id: '1000.008.052',
          navn: 'Ftrl - § 8-52',
          beskrivelse: 'Folketrygdloven - § 8-52',
        },
        {
          id: '1000.008.053',
          navn: 'Ftrl - § 8-53',
          beskrivelse: 'Folketrygdloven - § 8-53',
        },
        {
          id: '1000.008.054',
          navn: 'Ftrl - § 8-54',
          beskrivelse: 'Folketrygdloven - § 8-54',
        },
        {
          id: '1000.008.055',
          navn: 'Ftrl - § 8-55',
          beskrivelse: 'Folketrygdloven - § 8-55',
        },
        {
          id: '108',
          navn: 'Ftrl - § 21-3',
          beskrivelse: 'Folketrygdloven - § 21-3',
        },
        {
          id: 'FTRL_21_7',
          navn: 'Ftrl - § 21-7',
          beskrivelse: 'Folketrygdloven - § 21-7',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.003',
          navn: 'Ftrl - § 22-3',
          beskrivelse: 'Folketrygdloven - § 22-3',
        },
        {
          id: 'FTRL_22_10',
          navn: 'Ftrl - § 22-10',
          beskrivelse: 'Folketrygdloven - § 22-10',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'ANKENEMNDA',
          navn: 'Ftrl - Ankenemnda',
          beskrivelse: 'Folketrygdloven - Ankenemnda',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '44',
      navn: 'Tilleggsstønad',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '46',
            navn: 'Tilleggsstønadforskriften',
            beskrivelse: 'Tilleggsstønadsforskriften',
          },
          registreringshjemler: [
            {
              id: 'FS_TILL_ST_1',
              navn: '§ 1',
            },
            {
              id: '760',
              navn: '§ 1 andre ledd',
            },
            {
              id: '761',
              navn: '§ 1 tredje ledd',
            },
            {
              id: '762',
              navn: '§§ 3 og 5 – reise',
            },
            {
              id: '763',
              navn: '§§ 4 og 5 – mobilitet',
            },
            {
              id: '764',
              navn: '§§ 6 og 7 - flytting',
            },
            {
              id: '765',
              navn: '§§ 8 og 9 - bolig',
            },
            {
              id: '766',
              navn: '§§ 10 og 11 – tilsyn',
            },
            {
              id: '767',
              navn: '§§ 12 og 13- læremidler',
            },
            {
              id: '768',
              navn: '§ 14 - fravær',
            },
            {
              id: '769',
              navn: '§ 15 andre ledd',
            },
            {
              id: '770',
              navn: '§ 15 tredje ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '40',
            navn: 'Arbeidsmarkedsloven',
            beskrivelse: 'Arbeidsmarkedsloven',
          },
          registreringshjemler: [
            {
              id: 'ARBML_2',
              navn: '§ 2',
            },
            {
              id: '708',
              navn: '§ 12',
            },
            {
              id: '723',
              navn: '§ 13',
            },
            {
              id: 'ARBML_15',
              navn: '§ 15',
            },
            {
              id: '709',
              navn: '§ 17',
            },
            {
              id: 'ARBML_19',
              navn: '§ 19',
            },
            {
              id: '724',
              navn: '§ 22',
            },
            {
              id: '725',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '832',
              navn: '§ 11A-3',
            },
            {
              id: '833',
              navn: '§ 11A-4',
            },
            {
              id: '815',
              navn: '§ 11A-4 tredje ledd',
            },
            {
              id: '441',
              navn: '§ 15-11',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '0287',
          navn: 'Nav Tiltak Øst-Viken',
        },
        {
          id: '0387',
          navn: 'Nav Tiltak Oslo',
        },
        {
          id: '0587',
          navn: 'Nav Tiltak Innlandet',
        },
        {
          id: '0687',
          navn: 'Nav Tiltak Vest-Viken',
        },
        {
          id: '0800',
          navn: 'Nav Vestfold og Telemark',
        },
        {
          id: '1087',
          navn: 'Nav Tiltak Agder',
        },
        {
          id: '1187',
          navn: 'Nav Tiltak Rogaland',
        },
        {
          id: '1287',
          navn: 'Nav Tiltak Vestland',
        },
        {
          id: '1500',
          navn: 'Nav Møre og Romsdal',
        },
        {
          id: '1800',
          navn: 'Nav Nordland',
        },
        {
          id: '1987',
          navn: 'Nav Tiltak Troms og Finnmark',
        },
        {
          id: '4402',
          navn: 'Nav Arbeid og ytelser Romerike',
        },
        {
          id: '4405',
          navn: 'Nav Arbeid og ytelser Innlandet',
        },
        {
          id: '4407',
          navn: 'Nav Arbeid og ytelser Tønsberg',
        },
        {
          id: '4411',
          navn: 'Nav Arbeid og ytelser Karmøy',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '5700',
          navn: 'Nav Trøndelag',
        },
        {
          id: '5771',
          navn: 'Nav Tiltak Trøndelag',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'ARBML_13',
          navn: 'Arbeidsmarkedsloven - § 13',
          beskrivelse: 'Arbeidsmarkedsloven - § 13',
        },
        {
          id: 'ARBML_17',
          navn: 'Arbeidsmarkedsloven - § 17',
          beskrivelse: 'Arbeidsmarkedsloven - § 17',
        },
        {
          id: 'ARBML_22',
          navn: 'Arbeidsmarkedsloven - § 22',
          beskrivelse: 'Arbeidsmarkedsloven - § 22',
        },
        {
          id: 'FTRL_11_A_3',
          navn: 'Ftrl - § 11A-3',
          beskrivelse: 'Folketrygdloven - § 11A-3',
        },
        {
          id: 'FTRL_11_A_4',
          navn: 'Ftrl - § 11A-4',
          beskrivelse: 'Folketrygdloven - § 11A-4',
        },
        {
          id: 'FTRL_11_A_4_3',
          navn: 'Ftrl - § 11A-4 tredje ledd',
          beskrivelse: 'Folketrygdloven - § 11A-4 tredje ledd',
        },
        {
          id: '441',
          navn: 'Ftrl - § 15-11',
          beskrivelse: 'Folketrygdloven - § 15-11',
        },
        {
          id: 'FTRL_17_10',
          navn: 'Ftrl - § 17-10 tilleggsstønader',
          beskrivelse: 'Folketrygdloven - § 17-10 tilleggsstønader',
        },
        {
          id: 'FTRL_17_15',
          navn: 'Ftrl - § 17-15 familiepleier',
          beskrivelse: 'Folketrygdloven - § 17-15 familiepleier',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: '1000.022.013',
          navn: 'Ftrl - § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17A',
          navn: 'Ftrl - § 22-17a',
          beskrivelse: 'Folketrygdloven - § 22-17a',
        },
        {
          id: 'FS_TILL_ST_1_3_MOBILITET',
          navn: 'Tilleggsstønadsforskriften - § 1 tredje ledd - mobilitet',
          beskrivelse: 'Tilleggsstønadforskriften - § 1 tredje ledd - mobilitet',
        },
        {
          id: 'FS_TILL_ST_3_REISE',
          navn: 'Tilleggsstønadsforskriften - § 3 - reise',
          beskrivelse: 'Tilleggsstønadforskriften - § 3 - reise',
        },
        {
          id: 'FS_TILL_ST_6_FLYTTING',
          navn: 'Tilleggsstønadsforskriften - § 6 - flytting',
          beskrivelse: 'Tilleggsstønadforskriften - § 6 - flytting',
        },
        {
          id: 'FS_TILL_ST_8_BOLIG',
          navn: 'Tilleggsstønadsforskriften - § 8 - bolig',
          beskrivelse: 'Tilleggsstønadforskriften - § 8 - bolig',
        },
        {
          id: 'FS_TILL_ST_10_TILSYN',
          navn: 'Tilleggsstønadsforskriften - § 10 - tilsyn',
          beskrivelse: 'Tilleggsstønadforskriften - § 10 - tilsyn',
        },
        {
          id: 'FS_TILL_ST_12_LAEREMIDLER',
          navn: 'Tilleggsstønadsforskriften - § 12 - læremidler',
          beskrivelse: 'Tilleggsstønadforskriften - § 12 - læremidler',
        },
        {
          id: 'FS_TILL_ST_15_2',
          navn: 'Tilleggsstønadsforskriften - § 15 andre ledd',
          beskrivelse: 'Tilleggsstønadforskriften - § 15 andre ledd',
        },
        {
          id: 'FS_TILL_ST_15_3',
          navn: 'Tilleggsstønadsforskriften - § 15 tredje ledd',
          beskrivelse: 'Tilleggsstønadforskriften - § 15 tredje ledd',
        },
        {
          id: 'FL_2_3',
          navn: 'Fl - §§ 2 og 3',
          beskrivelse: 'Foreldelsesloven - §§ 2 og 3',
        },
        {
          id: 'FL_10',
          navn: 'Fl - § 10',
          beskrivelse: 'Foreldelsesloven - § 10',
        },
        {
          id: 'FVL_11',
          navn: 'Fvl - § 11',
          beskrivelse: 'Forvaltningsloven - § 11',
        },
        {
          id: 'FVL_17',
          navn: 'Fvl - § 17',
          beskrivelse: 'Forvaltningsloven - § 17',
        },
        {
          id: 'FVL_18_19',
          navn: 'Fvl - §§ 18 og 19',
          beskrivelse: 'Forvaltningsloven - §§ 18 og 19',
        },
        {
          id: 'FVL_35',
          navn: 'Fvl - § 35',
          beskrivelse: 'Forvaltningsloven - § 35',
        },
        {
          id: 'FVL_41',
          navn: 'Fvl - § 41',
          beskrivelse: 'Forvaltningsloven - § 41',
        },
        {
          id: 'FVL_42',
          navn: 'Fvl - § 42',
          beskrivelse: 'Forvaltningsloven - § 42',
        },
      ],
    },
    {
      id: '33',
      navn: 'Tiltakspenger',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '40',
            navn: 'Arbeidsmarkedsloven',
            beskrivelse: 'Arbeidsmarkedsloven',
          },
          registreringshjemler: [
            {
              id: 'ARBML_2',
              navn: '§ 2',
            },
            {
              id: '708',
              navn: '§ 12',
            },
            {
              id: '723',
              navn: '§ 13',
            },
            {
              id: 'ARBML_15',
              navn: '§ 15',
            },
            {
              id: '709',
              navn: '§ 17',
            },
            {
              id: 'ARBML_19',
              navn: '§ 19',
            },
            {
              id: '724',
              navn: '§ 22',
            },
            {
              id: '725',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '60',
            navn: 'Forskrift om tiltakspenger',
            beskrivelse: 'Tiltakspengeforskriften',
          },
          registreringshjemler: [
            {
              id: '726',
              navn: '§ 2',
            },
            {
              id: '727',
              navn: '§ 3',
            },
            {
              id: '729',
              navn: '§ 5',
            },
            {
              id: '730',
              navn: '§ 6',
            },
            {
              id: '731',
              navn: '§ 7',
            },
            {
              id: '732',
              navn: '§ 8',
            },
            {
              id: '733',
              navn: '§ 9',
            },
            {
              id: '734',
              navn: '§ 10',
            },
            {
              id: '735',
              navn: '§ 11',
            },
          ],
        },
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '54',
            navn: 'Forskrift om oppfølgingstjenester i Arbeids- og velferdsetatens egen regi',
            beskrivelse: 'Forskrift om oppfølgingstjenester i Arbeids- og velferdsetatens egen regi',
          },
          registreringshjemler: [
            {
              id: '830',
              navn: '§ 8',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '0387',
          navn: 'Nav Tiltak Oslo',
        },
        {
          id: '0587',
          navn: 'Nav Tiltak Innlandet',
        },
        {
          id: '0687',
          navn: 'Nav Tiltak Vest-Viken',
        },
        {
          id: '1087',
          navn: 'Nav Tiltak Agder',
        },
        {
          id: '1187',
          navn: 'Nav Tiltak Rogaland',
        },
        {
          id: '1287',
          navn: 'Nav Tiltak Vestland',
        },
        {
          id: '1987',
          navn: 'Nav Tiltak Troms og Finnmark',
        },
        {
          id: '5771',
          navn: 'Nav Tiltak Trøndelag',
        },
        {
          id: '0287',
          navn: 'Nav Tiltak Øst-Viken',
        },
        {
          id: '0101',
          navn: 'Nav Halden-Aremark',
        },
        {
          id: '0104',
          navn: 'Nav Moss',
        },
        {
          id: '0105',
          navn: 'Nav Sarpsborg',
        },
        {
          id: '0106',
          navn: 'Nav Fredrikstad',
        },
        {
          id: '0111',
          navn: 'Nav Hvaler',
        },
        {
          id: '0119',
          navn: 'Nav Skiptvet Marker',
        },
        {
          id: '0124',
          navn: 'Nav Indre Østfold',
        },
        {
          id: '0127',
          navn: 'Nav Skiptvet',
        },
        {
          id: '0128',
          navn: 'Nav Rakkestad',
        },
        {
          id: '0135',
          navn: 'Nav Råde',
        },
        {
          id: '1037',
          navn: 'Nav Lister',
        },
        {
          id: '0211',
          navn: 'Nav Vestby',
        },
        {
          id: '0213',
          navn: 'Nav Nordre Follo',
        },
        {
          id: '0214',
          navn: 'Nav Ås',
        },
        {
          id: '0215',
          navn: 'Nav Frogn',
        },
        {
          id: '0219',
          navn: 'Nav Bærum',
        },
        {
          id: '0220',
          navn: 'Nav Asker',
        },
        {
          id: '0221',
          navn: 'Nav Aurskog-Høland',
        },
        {
          id: '0228',
          navn: 'Nav Rælingen',
        },
        {
          id: '0229',
          navn: 'Nav Enebakk',
        },
        {
          id: '0230',
          navn: 'Nav Lørenskog',
        },
        {
          id: '0231',
          navn: 'Nav Lillestrøm',
        },
        {
          id: '0233',
          navn: 'Nav Nittedal',
        },
        {
          id: '0234',
          navn: 'Nav Gjerdrum',
        },
        {
          id: '0235',
          navn: 'Nav Ullensaker',
        },
        {
          id: '0236',
          navn: 'Nav Nes i Akershus',
        },
        {
          id: '0237',
          navn: 'Nav Eidsvoll',
        },
        {
          id: '0238',
          navn: 'Nav Nannestad Gjerdrum',
        },
        {
          id: '0239',
          navn: 'Nav Hurdal',
        },
        {
          id: '0283',
          navn: 'Nav egne ansatte Øst-Viken',
        },
        {
          id: '0312',
          navn: 'Nav Frogner',
        },
        {
          id: '0313',
          navn: 'Nav St. Hanshaugen',
        },
        {
          id: '0314',
          navn: 'Nav Sagene',
        },
        {
          id: '0315',
          navn: 'Nav Grünerløkka',
        },
        {
          id: '0316',
          navn: 'Nav Gamle Oslo',
        },
        {
          id: '0318',
          navn: 'Nav Nordstrand',
        },
        {
          id: '0319',
          navn: 'Nav Søndre Nordstrand',
        },
        {
          id: '0321',
          navn: 'Nav Østensjø',
        },
        {
          id: '0326',
          navn: 'Nav Alna',
        },
        {
          id: '0327',
          navn: 'Nav Stovner',
        },
        {
          id: '0328',
          navn: 'Nav Grorud',
        },
        {
          id: '0330',
          navn: 'Nav Bjerke',
        },
        {
          id: '0331',
          navn: 'Nav Nordre Aker',
        },
        {
          id: '0334',
          navn: 'Nav Vestre Aker',
        },
        {
          id: '0383',
          navn: 'Nav egne ansatte Oslo',
        },
        {
          id: '0402',
          navn: 'Nav Kongsvinger',
        },
        {
          id: '0403',
          navn: 'Nav Hamar',
        },
        {
          id: '0412',
          navn: 'Nav Ringsaker',
        },
        {
          id: '0415',
          navn: 'Nav Løten',
        },
        {
          id: '0417',
          navn: 'Nav Stange',
        },
        {
          id: '0418',
          navn: 'Nav Nord-Odal',
        },
        {
          id: '0420',
          navn: 'Nav Eidskog',
        },
        {
          id: '0423',
          navn: 'Nav Grue',
        },
        {
          id: '0425',
          navn: 'Nav Åsnes',
        },
        {
          id: '0426',
          navn: 'Nav Våler i Hedmark',
        },
        {
          id: '0427',
          navn: 'Nav Elverum',
        },
        {
          id: '0428',
          navn: 'Nav Trysil',
        },
        {
          id: '0429',
          navn: 'Nav Åmot',
        },
        {
          id: '0430',
          navn: 'Nav Stor-Elvdal',
        },
        {
          id: '0434',
          navn: 'Nav Engerdal',
        },
        {
          id: '0437',
          navn: 'Nav Nord-Østerdal',
        },
        {
          id: '0439',
          navn: 'Nav Folldal',
        },
        {
          id: '0450',
          navn: 'ENHET FOR ARBEIDSGIVER- OG ARBEIDSTAKERREGISTERET',
        },
        {
          id: '0483',
          navn: 'Nav egne ansatte Innlandet',
        },
        {
          id: '0501',
          navn: 'Nav Lillehammer-Gausdal',
        },
        {
          id: '0502',
          navn: 'Nav Gjøvik',
        },
        {
          id: '0511',
          navn: 'Nav Lesja - Dovre',
        },
        {
          id: '0513',
          navn: 'Nav Lom-Skjåk',
        },
        {
          id: '0515',
          navn: 'Nav Vågå',
        },
        {
          id: '0516',
          navn: 'Nav Midt-Gudbrandsdal',
        },
        {
          id: '0517',
          navn: 'Nav Sel',
        },
        {
          id: '0519',
          navn: 'Nav Sør-Fron',
        },
        {
          id: '0521',
          navn: 'Nav Øyer',
        },
        {
          id: '0528',
          navn: 'Nav Østre Toten',
        },
        {
          id: '0529',
          navn: 'Nav Vestre Toten',
        },
        {
          id: '0532',
          navn: 'Nav Jevnaker',
        },
        {
          id: '0534',
          navn: 'Nav Hadeland',
        },
        {
          id: '0536',
          navn: 'Nav Søndre Land',
        },
        {
          id: '0538',
          navn: 'Nav Nordre Land',
        },
        {
          id: '0542',
          navn: 'Nav Valdres',
        },
        {
          id: '0600',
          navn: 'Nav Vest-Viken',
        },
        {
          id: '0602',
          navn: 'Nav Drammen',
        },
        {
          id: '0604',
          navn: 'Nav Kongsberg',
        },
        {
          id: '0605',
          navn: 'Nav Ringerike',
        },
        {
          id: '0612',
          navn: 'Nav Hole',
        },
        {
          id: '0617',
          navn: 'Nav Hallingdal',
        },
        {
          id: '0621',
          navn: 'Nav Sigdal',
        },
        {
          id: '0622',
          navn: 'Nav Krødsherad',
        },
        {
          id: '0623',
          navn: 'Nav Midt-Buskerud',
        },
        {
          id: '0624',
          navn: 'Nav Øvre Eiker',
        },
        {
          id: '0626',
          navn: 'Nav Lier',
        },
        {
          id: '0632',
          navn: 'Nav Numedal',
        },
        {
          id: '0683',
          navn: 'Nav egne ansatte Vest-Viken',
        },
        {
          id: '0701',
          navn: 'Nav Horten',
        },
        {
          id: '0704',
          navn: 'Nav Tønsberg',
        },
        {
          id: '0710',
          navn: 'Nav Sandefjord',
        },
        {
          id: '5301',
          navn: 'Nav Holmestrand',
        },
        {
          id: '5303',
          navn: 'Nav Larvik',
        },
        {
          id: '5302',
          navn: 'Nav Færder',
        },
        {
          id: '0800',
          navn: 'Nav Vestfold og Telemark',
        },
        {
          id: '0805',
          navn: 'Nav Porsgrunn',
        },
        {
          id: '0806',
          navn: 'Nav Skien',
        },
        {
          id: '0811',
          navn: 'Nav Siljan',
        },
        {
          id: '0814',
          navn: 'Nav Bamble',
        },
        {
          id: '0815',
          navn: 'Nav Kragerø',
        },
        {
          id: '0817',
          navn: 'Nav Drangedal',
        },
        {
          id: '0821',
          navn: 'Nav Midt-Telemark',
        },
        {
          id: '0826',
          navn: 'Nav Tinn',
        },
        {
          id: '0833',
          navn: 'Nav Vest-Telemark',
        },
        {
          id: '0883',
          navn: 'Nav egne ansatte Vestfold og Telemark',
        },
        {
          id: '0904',
          navn: 'Nav Grimstad',
        },
        {
          id: '0906',
          navn: 'Nav Arendal',
        },
        {
          id: '0901',
          navn: 'Nav Risør',
        },
        {
          id: '0911',
          navn: 'Nav Gjerstad',
        },
        {
          id: '0914',
          navn: 'Nav Øst i Agder',
        },
        {
          id: '0919',
          navn: 'Nav Froland',
        },
        {
          id: '0928',
          navn: 'Nav Birkenes',
        },
        {
          id: '0929',
          navn: 'Nav Åmli',
        },
        {
          id: '0937',
          navn: 'Nav Evje og Hornnes',
        },
        {
          id: '0926',
          navn: 'Nav Lillesand',
        },
        {
          id: '1001',
          navn: 'Nav Kristiansand',
        },
        {
          id: '1002',
          navn: 'Nav Lindesnes',
        },
        {
          id: '1014',
          navn: 'Nav Midt-Agder',
        },
        {
          id: '1004',
          navn: 'Nav Flekkefjord',
        },
        {
          id: '1032',
          navn: 'Nav Lyngdal',
        },
        {
          id: '1034',
          navn: 'Nav Hægebostad',
        },
        {
          id: '1046',
          navn: 'Nav Sirdal',
        },
        {
          id: '1083',
          navn: 'Nav egne ansatte Agder',
        },
        {
          id: '1101',
          navn: 'Nav Dalane',
        },
        {
          id: '1102',
          navn: 'Nav Sandnes',
        },
        {
          id: '1106',
          navn: 'Nav Haugesund-Utsira',
        },
        {
          id: '1111',
          navn: 'Nav Sokndal',
        },
        {
          id: '1112',
          navn: 'Nav Lund',
        },
        {
          id: '1119',
          navn: 'Nav Hå',
        },
        {
          id: '1120',
          navn: 'Nav Klepp-Time',
        },
        {
          id: '1122',
          navn: 'Nav Gjesdal',
        },
        {
          id: '1124',
          navn: 'Nav Sola',
        },
        {
          id: '1127',
          navn: 'Nav Randaberg-Kvitsøy',
        },
        {
          id: '1130',
          navn: 'Nav Strand',
        },
        {
          id: '1133',
          navn: 'Nav Hjelmeland',
        },
        {
          id: '1134',
          navn: 'Nav Suldal',
        },
        {
          id: '1135',
          navn: 'Nav Sauda',
        },
        {
          id: '1146',
          navn: 'Nav Tysvær',
        },
        {
          id: '1149',
          navn: 'Nav Karmøy-Bokn',
        },
        {
          id: '1160',
          navn: 'Nav Vindafjord-Etne',
        },
        {
          id: '1161',
          navn: 'Nav Eiganes og Tasta',
        },
        {
          id: '1162',
          navn: 'Nav Hundvåg og Storhaug',
        },
        {
          id: '1164',
          navn: 'Nav Hillevåg og Hinna',
        },
        {
          id: '1165',
          navn: 'Nav Madla',
        },
        {
          id: '1169',
          navn: 'Nav Rennesøy og Finnøy',
        },
        {
          id: '1183',
          navn: 'Nav egne ansatte Rogaland',
        },
        {
          id: '1202',
          navn: 'Nav Bergen sør',
        },
        {
          id: '1203',
          navn: 'Nav Bergen nord',
        },
        {
          id: '1204',
          navn: 'Nav Arna',
        },
        {
          id: '1205',
          navn: 'Nav Fyllingsdalen',
        },
        {
          id: '1206',
          navn: 'Nav Bergen vest',
        },
        {
          id: '1208',
          navn: 'Nav Årstad',
        },
        {
          id: '1209',
          navn: 'Nav Bergenhus',
        },
        {
          id: '1210',
          navn: 'Nav Ytrebygda',
        },
        {
          id: '1211',
          navn: 'Nav Etne',
        },
        {
          id: '1216',
          navn: 'Nav Sveio',
        },
        {
          id: '1219',
          navn: 'Nav Bømlo',
        },
        {
          id: '1221',
          navn: 'Nav Stord',
        },
        {
          id: '1222',
          navn: 'Nav Fitjar',
        },
        {
          id: '1223',
          navn: 'Nav Tysnes',
        },
        {
          id: '1224',
          navn: 'Nav Kvinnherad',
        },
        {
          id: '1228',
          navn: 'Nav Ullensvang',
        },
        {
          id: '1232',
          navn: 'Nav Eidfjord',
        },
        {
          id: '1233',
          navn: 'Nav Ulvik',
        },
        {
          id: '1235',
          navn: 'Nav Voss',
        },
        {
          id: '1238',
          navn: 'Nav Kvam',
        },
        {
          id: '1242',
          navn: 'Nav Samnanger',
        },
        {
          id: '1243',
          navn: 'Nav Bjørnafjorden',
        },
        {
          id: '1244',
          navn: 'Nav Austevoll',
        },
        {
          id: '1246',
          navn: 'Nav Øygarden',
        },
        {
          id: '1247',
          navn: 'Nav Askøy',
        },
        {
          id: '1251',
          navn: 'Nav Vaksdal',
        },
        {
          id: '1253',
          navn: 'Nav Osterøy',
        },
        {
          id: '1263',
          navn: 'Nav Alver',
        },
        {
          id: '1266',
          navn: 'Nav Fensfjorden',
        },
        {
          id: '1283',
          navn: 'Nav egne ansatte Vestland',
        },
        {
          id: '1401',
          navn: 'Nav Kinn',
        },
        {
          id: '1412',
          navn: 'Nav Solund',
        },
        {
          id: '1413',
          navn: 'Nav Hyllestad',
        },
        {
          id: '1416',
          navn: 'Nav Høyanger',
        },
        {
          id: '1417',
          navn: 'Nav Vik',
        },
        {
          id: '1420',
          navn: 'Nav Sogndal',
        },
        {
          id: '1421',
          navn: 'Nav Aurland',
        },
        {
          id: '1422',
          navn: 'Nav Lærdal',
        },
        {
          id: '1424',
          navn: 'Nav Årdal',
        },
        {
          id: '1426',
          navn: 'Nav Luster',
        },
        {
          id: '1428',
          navn: 'Nav Askvoll',
        },
        {
          id: '1429',
          navn: 'Nav Fjaler',
        },
        {
          id: '1432',
          navn: 'Nav Sunnfjord',
        },
        {
          id: '1438',
          navn: 'Nav Bremanger',
        },
        {
          id: '1443',
          navn: 'Nav Stad',
        },
        {
          id: '1445',
          navn: 'Nav Gloppen',
        },
        {
          id: '1449',
          navn: 'Nav Stryn',
        },
        {
          id: '1500',
          navn: 'Nav Møre og Romsdal',
        },
        {
          id: '1502',
          navn: 'Nav Molde',
        },
        {
          id: '1504',
          navn: 'Nav Ålesund',
        },
        {
          id: '1505',
          navn: 'Nav Kristiansund',
        },
        {
          id: '1515',
          navn: 'Nav Herøy og Vanylven',
        },
        {
          id: '1517',
          navn: 'Nav Hareid - Ulstein - Sande',
        },
        {
          id: '1520',
          navn: 'Nav Ørsta Volda',
        },
        {
          id: '1525',
          navn: 'Nav Stranda',
        },
        {
          id: '1528',
          navn: 'Nav Sykkylven - Stranda',
        },
        {
          id: '1529',
          navn: 'Nav Fjord',
        },
        {
          id: '1531',
          navn: 'Nav Sula',
        },
        {
          id: '1532',
          navn: 'Nav Giske',
        },
        {
          id: '1535',
          navn: 'Nav Vestnes',
        },
        {
          id: '1539',
          navn: 'Nav Rauma',
        },
        {
          id: '1547',
          navn: 'Nav Aukra',
        },
        {
          id: '1548',
          navn: 'Nav Hustadvika',
        },
        {
          id: '1554',
          navn: 'Nav Averøy',
        },
        {
          id: '1557',
          navn: 'Nav Gjemnes',
        },
        {
          id: '1560',
          navn: 'Nav Tingvoll',
        },
        {
          id: '1563',
          navn: 'Nav Indre Nordmøre',
        },
        {
          id: '1566',
          navn: 'Nav Surnadal',
        },
        {
          id: '1567',
          navn: 'Nav Rindal',
        },
        {
          id: '1572',
          navn: 'Nav Tustna',
        },
        {
          id: '1573',
          navn: 'Nav Smøla',
        },
        {
          id: '1576',
          navn: 'Nav Aure',
        },
        {
          id: '1583',
          navn: 'Nav egne ansatte Møre og Romsdal',
        },
        {
          id: '1607',
          navn: 'Nav Heimdal',
        },
        {
          id: '1612',
          navn: 'Nav Heim',
        },
        {
          id: '1620',
          navn: 'Nav Hitra Frøya',
        },
        {
          id: '1621',
          navn: 'Nav Ørland',
        },
        {
          id: '1624',
          navn: 'Nav Rissa',
        },
        {
          id: '1627',
          navn: 'Nav Bjugn',
        },
        {
          id: '1630',
          navn: 'Nav Nord-Fosen',
        },
        {
          id: '1634',
          navn: 'Nav Oppdal og Rennebu',
        },
        {
          id: '1638',
          navn: 'Nav Orkland',
        },
        {
          id: '1640',
          navn: 'Nav Røros, Os og Holtålen',
        },
        {
          id: '1644',
          navn: 'Nav Holtålen',
        },
        {
          id: '1648',
          navn: 'Nav Midtre Gauldal',
        },
        {
          id: '1653',
          navn: 'Nav Melhus',
        },
        {
          id: '1657',
          navn: 'Nav Skaun',
        },
        {
          id: '1663',
          navn: 'Nav Malvik',
        },
        {
          id: '1683',
          navn: 'Nav egne ansatte Trøndelag',
        },
        {
          id: '1702',
          navn: 'Nav Inn-Trøndelag',
        },
        {
          id: '1703',
          navn: 'Nav Midtre Namdal',
        },
        {
          id: '1718',
          navn: 'Nav Leksvik',
        },
        {
          id: '1719',
          navn: 'Nav Levanger',
        },
        {
          id: '1721',
          navn: 'Nav Verdal',
        },
        {
          id: '1724',
          navn: 'Nav Verran',
        },
        {
          id: '1725',
          navn: 'Nav Namdalseid',
        },
        {
          id: '1729',
          navn: 'Avviklet - Nav Inderøy',
        },
        {
          id: '1736',
          navn: 'Nav Snåsa',
        },
        {
          id: '1738',
          navn: 'Nav Lierne',
        },
        {
          id: '1739',
          navn: 'Nav Røyrvik',
        },
        {
          id: '1740',
          navn: 'Nav Namsskogan',
        },
        {
          id: '1742',
          navn: 'Nav Indre Namdal',
        },
        {
          id: '1743',
          navn: 'Nav Høylandet',
        },
        {
          id: '1744',
          navn: 'Nav Overhalla',
        },
        {
          id: '1748',
          navn: 'Nav Fosnes',
        },
        {
          id: '1749',
          navn: 'Nav Flatanger',
        },
        {
          id: '1750',
          navn: 'Nav Vikna',
        },
        {
          id: '1751',
          navn: 'Nav Nærøysund',
        },
        {
          id: '1755',
          navn: 'Nav Leka',
        },
        {
          id: '1756',
          navn: 'Nav Inderøy',
        },
        {
          id: '1800',
          navn: 'Nav Nordland',
        },
        {
          id: '1804',
          navn: 'Nav Bodø',
        },
        {
          id: '1805',
          navn: 'Nav Narvik',
        },
        {
          id: '1812',
          navn: 'Nav Sømna',
        },
        {
          id: '1813',
          navn: 'Nav Sør-Helgeland',
        },
        {
          id: '1815',
          navn: 'Nav Vega',
        },
        {
          id: '1816',
          navn: 'Nav Vevelstad',
        },
        {
          id: '1818',
          navn: 'Nav Herøy',
        },
        {
          id: '1820',
          navn: 'Nav Ytre Helgeland',
        },
        {
          id: '1822',
          navn: 'Nav Leirfjord',
        },
        {
          id: '1824',
          navn: 'Nav Vefsna',
        },
        {
          id: '1825',
          navn: 'Nav Grane',
        },
        {
          id: '1826',
          navn: 'Nav Hattfjelldal',
        },
        {
          id: '1827',
          navn: 'Nav Dønna',
        },
        {
          id: '1828',
          navn: 'Nav Nesna',
        },
        {
          id: '1832',
          navn: 'Nav Hemnes',
        },
        {
          id: '1833',
          navn: 'Nav Rana',
        },
        {
          id: '1834',
          navn: 'Nav Lurøy',
        },
        {
          id: '1835',
          navn: 'Nav Træna',
        },
        {
          id: '1836',
          navn: 'Nav Rødøy',
        },
        {
          id: '1837',
          navn: 'Nav Meløy',
        },
        {
          id: '1838',
          navn: 'Nav Gildeskål',
        },
        {
          id: '1839',
          navn: 'Nav Beiarn',
        },
        {
          id: '1840',
          navn: 'Nav Saltdal',
        },
        {
          id: '1841',
          navn: 'Nav Indre Salten',
        },
        {
          id: '1845',
          navn: 'Nav Sørfold',
        },
        {
          id: '1848',
          navn: 'Nav Steigen',
        },
        {
          id: '1849',
          navn: 'Nav Hamarøy',
        },
        {
          id: '1850',
          navn: 'Nav Tysfjord',
        },
        {
          id: '1851',
          navn: 'Nav Lødingen',
        },
        {
          id: '1852',
          navn: 'Nav Evenes og Tjeldsund',
        },
        {
          id: '1854',
          navn: 'Nav Ballangen',
        },
        {
          id: '1856',
          navn: 'Nav Røst',
        },
        {
          id: '1857',
          navn: 'Nav Værøy',
        },
        {
          id: '1859',
          navn: 'Nav Flakstad',
        },
        {
          id: '1860',
          navn: 'Nav Lofoten',
        },
        {
          id: '1865',
          navn: 'Nav Svolvær',
        },
        {
          id: '1866',
          navn: 'Nav Hadsel',
        },
        {
          id: '1867',
          navn: 'Nav Bø',
        },
        {
          id: '1868',
          navn: 'Nav Øksnes',
        },
        {
          id: '1870',
          navn: 'Nav Sortland',
        },
        {
          id: '1871',
          navn: 'Nav Andøy',
        },
        {
          id: '1874',
          navn: 'Nav Moskenes',
        },
        {
          id: '1883',
          navn: 'Nav egne ansatte Nordland',
        },
        {
          id: '1902',
          navn: 'Nav Tromsø',
        },
        {
          id: '1903',
          navn: 'Nav Sør-Troms',
        },
        {
          id: '1911',
          navn: 'Nav Kvæfjord',
        },
        {
          id: '1913',
          navn: 'Nav Tjeldsund',
        },
        {
          id: '1917',
          navn: 'Nav Ibestad',
        },
        {
          id: '1919',
          navn: 'Nav Gratangen',
        },
        {
          id: '1920',
          navn: 'Nav Lavangen',
        },
        {
          id: '1922',
          navn: 'Nav Bardu',
        },
        {
          id: '1923',
          navn: 'Nav Salangen-Lavangen-Dyrøy',
        },
        {
          id: '1924',
          navn: 'Nav Målselv-Bardu',
        },
        {
          id: '1925',
          navn: 'Nav Sørreisa',
        },
        {
          id: '1926',
          navn: 'Nav Dyrøy',
        },
        {
          id: '1927',
          navn: 'Nav Tranøy',
        },
        {
          id: '1928',
          navn: 'Nav Torsken',
        },
        {
          id: '1929',
          navn: 'Nav Berg',
        },
        {
          id: '1931',
          navn: 'Nav Senja-Sørreisa',
        },
        {
          id: '1933',
          navn: 'Nav Balsfjord-Storfjord',
        },
        {
          id: '1936',
          navn: 'Nav Karlsøy',
        },
        {
          id: '1938',
          navn: 'Nav Lyngen',
        },
        {
          id: '1939',
          navn: 'Nav Storfjord',
        },
        {
          id: '1940',
          navn: 'Nav Gáivuotna/Kåfjord',
        },
        {
          id: '1941',
          navn: 'Nav Skjervøy',
        },
        {
          id: '1942',
          navn: 'Nav Nordreisa',
        },
        {
          id: '1943',
          navn: 'Nav Kvænangen',
        },
        {
          id: '1983',
          navn: 'Nav egne ansatte Troms og Finnmark',
        },
        {
          id: '2002',
          navn: 'Nav Vardø',
        },
        {
          id: '2003',
          navn: 'Nav Vadsø',
        },
        {
          id: '2004',
          navn: 'Nav Hammerfest-Måsøy',
        },
        {
          id: '2011',
          navn: 'Nav Guovdageaidnu/Kautokeino',
        },
        {
          id: '2012',
          navn: 'Nav Alta-Kvænangen-Loppa',
        },
        {
          id: '2014',
          navn: 'Nav Loppa',
        },
        {
          id: '2015',
          navn: 'Nav Hasvik',
        },
        {
          id: '2017',
          navn: 'Nav Kvalsund',
        },
        {
          id: '2018',
          navn: 'Nav Måsøy',
        },
        {
          id: '2019',
          navn: 'Nav Nordkapp',
        },
        {
          id: '2020',
          navn: 'Nav Porsanger',
        },
        {
          id: '2021',
          navn: 'Nav Karasjohka/Karasjok',
        },
        {
          id: '2022',
          navn: 'Nav Lebesby',
        },
        {
          id: '2023',
          navn: 'Nav Gamvik',
        },
        {
          id: '2024',
          navn: 'Nav Berlevåg',
        },
        {
          id: '2025',
          navn: 'Nav Deatnu/Tana',
        },
        {
          id: '2027',
          navn: 'Nav Unjárga/Nesseby',
        },
        {
          id: '2028',
          navn: 'Nav Båtsfjord',
        },
        {
          id: '2030',
          navn: 'Nav Sør-Varanger',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4250',
          navn: 'Nav Klageinstans sør',
        },
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '39',
      navn: 'Tvungen forvalting',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '746',
              navn: '§ 22-6 første ledd første setning',
            },
            {
              id: '747',
              navn: '§ 22-6 første ledd andre setning',
            },
            {
              id: '748',
              navn: '§ 22-6 andre ledd',
            },
            {
              id: '749',
              navn: '§ 22-6 tredje ledd',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4407',
          navn: 'Nav Arbeid og ytelser Tønsberg',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '4808',
          navn: 'Nav Familie- og pensjonsytelser Porsgrunn',
        },
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '4815',
          navn: 'Nav Familie- og pensjonsytelser Ålesund',
        },
        {
          id: '4817',
          navn: 'Nav Familie- og pensjonsytelser Steinkjer',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [],
    },
    {
      id: '35',
      navn: 'Uføretrygd',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: '218',
              navn: '§ 2-1',
            },
            {
              id: '219',
              navn: '§ 2-2',
            },
            {
              id: '220',
              navn: '§ 2-14',
            },
            {
              id: '335',
              navn: '§ 12-2',
            },
            {
              id: '336',
              navn: '§ 12-3',
            },
            {
              id: '337',
              navn: '§ 12-4',
            },
            {
              id: '338',
              navn: '§ 12-5',
            },
            {
              id: 'FTRL_12_5_PROSJEKT',
              navn: '§ 12-5 Prosjekt NAY',
            },
            {
              id: '339',
              navn: '§ 12-6',
            },
            {
              id: '340',
              navn: '§ 12-7',
            },
            {
              id: '341',
              navn: '§ 12-8',
            },
            {
              id: 'FTRL_12_8A',
              navn: '§ 12-8 (ung ufør)',
            },
            {
              id: '342',
              navn: '§ 12-9',
            },
            {
              id: 'FTRL_12_9C',
              navn: '§ 12-9 (IEU)',
            },
            {
              id: 'FTRL_12_9D',
              navn: '§ 12-9 (IEU - selvstendig næringsdrivende/ansatt eget AS)',
            },
            {
              id: 'FTRL_12_9A',
              navn: '§ 12-9 (IFU)',
            },
            {
              id: 'FTRL_12_9B',
              navn: '§ 12-9 (IFU - stillingsandel)',
            },
            {
              id: '343',
              navn: '§ 12-10',
            },
            {
              id: '344',
              navn: '§ 12-11',
            },
            {
              id: '345',
              navn: '§ 12-12',
            },
            {
              id: '346',
              navn: '§ 12-13',
            },
            {
              id: 'FTRL_12_13C',
              navn: '§ 12-13 tredje ledd (36 års-regelen)',
            },
            {
              id: '347',
              navn: '§ 12-13 tredje ledd (ung ufør)',
            },
            {
              id: '348',
              navn: '§ 12-14',
            },
            {
              id: '349',
              navn: '§ 12-14 fjerde ledd (etteroppgjør)',
            },
            {
              id: '350',
              navn: '§ 12-15',
            },
            {
              id: '351',
              navn: '§ 12-16',
            },
            {
              id: '352',
              navn: '§ 12-17',
            },
            {
              id: '353',
              navn: '§ 12-18',
            },
            {
              id: '354',
              navn: '§ 12-19',
            },
            {
              id: '355',
              navn: '§ 12-20',
            },
            {
              id: '356',
              navn: '§ 12-21',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '143',
              navn: '§ 21-6',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '110',
              navn: '§ 21-8',
            },
            {
              id: '111',
              navn: '§ 21-10',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '221',
              navn: '§ 22-7',
            },
            {
              id: '266',
              navn: '§ 22-8',
            },
            {
              id: '366',
              navn: '§ 22-12 første ledd',
            },
            {
              id: '367',
              navn: '§ 22-12 andre ledd',
            },
            {
              id: '368',
              navn: '§ 22-12 tredje ledd',
            },
            {
              id: '369',
              navn: '§ 22-12 fjerde ledd',
            },
            {
              id: '370',
              navn: '§ 22-12 femte ledd',
            },
            {
              id: 'FTRL_22_12F',
              navn: '§ 22-12 sjette ledd',
            },
            {
              id: '222',
              navn: '§ 22-13 første ledd',
            },
            {
              id: '224',
              navn: '§ 22-13 tredje ledd',
            },
            {
              id: '226',
              navn: '§ 22-13 sjuende ledd',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '398',
              navn: '§ 22-16',
            },
            {
              id: '116',
              navn: '§ 22-17',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '17',
            navn: 'Forskrift om uføretrygd fra folketrygden',
            beskrivelse: 'Forskrift om uføretrygd fra folketrygden',
          },
          registreringshjemler: [
            {
              id: '357',
              navn: '§ 2-1',
            },
            {
              id: '358',
              navn: '§ 2-2',
            },
            {
              id: '359',
              navn: '§ 2-3',
            },
            {
              id: '360',
              navn: '§ 3-2',
            },
            {
              id: '361',
              navn: '§ 3-3',
            },
            {
              id: '362',
              navn: '§ 3-4',
            },
            {
              id: '363',
              navn: '§ 4-1',
            },
            {
              id: '364',
              navn: '§ 4-2',
            },
            {
              id: '365',
              navn: '§ 5-3',
            },
            {
              id: '831',
              navn: '§ 7-3',
            },
          ],
        },
        {
          lovkilde: {
            id: '10',
            navn: 'Foreldelsesloven',
            beskrivelse: 'Fl',
          },
          registreringshjemler: [
            {
              id: '151',
              navn: '§§ 2 og 3',
            },
            {
              id: '152',
              navn: '§ 10',
            },
            {
              id: 'FL_16',
              navn: '§ 16',
            },
            {
              id: 'FL_17',
              navn: '§ 17',
            },
            {
              id: 'FL_21',
              navn: '§ 21',
            },
            {
              id: 'FL_28',
              navn: '§ 28',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '118',
              navn: '§ 12',
            },
            {
              id: '842',
              navn: '§ 14',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '123',
              navn: '§ 24',
            },
            {
              id: '124',
              navn: '§ 25',
            },
            {
              id: '125',
              navn: '§ 28',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
            {
              id: '132',
              navn: '§ 41',
            },
            {
              id: '133',
              navn: '§ 42',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '134',
              navn: '§ 2',
            },
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
            {
              id: '137',
              navn: '§ 11',
            },
            {
              id: '138',
              navn: '§ 12',
            },
            {
              id: '139',
              navn: '§ 14',
            },
            {
              id: 'TRRL_27',
              navn: '§ 27',
            },
          ],
        },
        {
          lovkilde: {
            id: '11',
            navn: 'EØS forordning 883/2004',
            beskrivelse: 'EØS forordning 883/2004',
          },
          registreringshjemler: [
            {
              id: 'EOES_883_2004_5',
              navn: 'art. 5',
            },
            {
              id: '228',
              navn: 'art. 6',
            },
            {
              id: '372',
              navn: 'art. 7',
            },
            {
              id: '229',
              navn: 'art. 11',
            },
            {
              id: '230',
              navn: 'art. 12',
            },
            {
              id: '231',
              navn: 'art. 13',
            },
            {
              id: '373',
              navn: 'art. 44',
            },
            {
              id: '374',
              navn: 'art. 45',
            },
            {
              id: '375',
              navn: 'art. 46',
            },
            {
              id: '376',
              navn: 'art. 47',
            },
            {
              id: '377',
              navn: 'art. 48',
            },
            {
              id: '378',
              navn: 'art. 49',
            },
            {
              id: '379',
              navn: 'art. 50',
            },
            {
              id: '380',
              navn: 'art. 51',
            },
            {
              id: '381',
              navn: 'art. 52',
            },
            {
              id: '382',
              navn: 'art. 57',
            },
            {
              id: '383',
              navn: 'art. 58',
            },
            {
              id: '384',
              navn: 'art. 69',
            },
            {
              id: '385',
              navn: 'art. 70',
            },
            {
              id: '386',
              navn: 'art. 87',
            },
          ],
        },
        {
          lovkilde: {
            id: '18',
            navn: 'Forskrift om beregning av uføretrygd etter EØS- avtalen 883/2004',
            beskrivelse: 'Forskrift om beregning av uføretrygd etter EØS- avtalen',
          },
          registreringshjemler: [
            {
              id: 'FS_BER_UFT_EOS_883_2004',
              navn: 'Forskrift om beregning av uføretrygd etter EØS- avtalen 883/2004',
            },
          ],
        },
        {
          lovkilde: {
            id: '19',
            navn: 'Gjennomføringsforordning 987/2007',
            beskrivelse: 'Gjennomføringsforordning 987/2007',
          },
          registreringshjemler: [
            {
              id: '393',
              navn: 'art. 11',
            },
            {
              id: '394',
              navn: 'art. 12',
            },
          ],
        },
        {
          lovkilde: {
            id: '20',
            navn: 'Forordning 1408/71',
            beskrivelse: 'Forordning 1408/71',
          },
          registreringshjemler: [
            {
              id: '395',
              navn: 'Forordning 1408/71',
            },
          ],
        },
        {
          lovkilde: {
            id: '15',
            navn: 'Nordisk konvensjon',
            beskrivelse: 'Nordisk konvensjon',
          },
          registreringshjemler: [
            {
              id: '309',
              navn: 'Nordisk konvensjon',
            },
          ],
        },
        {
          lovkilde: {
            id: '21',
            navn: 'Andre trygdeavtaler',
            beskrivelse: 'Andre trygdeavtaler',
          },
          registreringshjemler: [
            {
              id: '396',
              navn: 'Andre trygdeavtaler',
            },
          ],
        },
        {
          lovkilde: {
            id: '22',
            navn: 'Gammelt regelverk',
            beskrivelse: 'Gammelt regelverk',
          },
          registreringshjemler: [
            {
              id: '397',
              navn: 'Gammelt regelverk',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4405',
          navn: 'Nav Arbeid og ytelser Innlandet',
        },
        {
          id: '4411',
          navn: 'Nav Arbeid og ytelser Karmøy',
        },
        {
          id: '4403',
          navn: 'Nav Arbeid og ytelser Kristiania',
        },
        {
          id: '4415',
          navn: 'Nav Arbeid og ytelser Molde',
        },
        {
          id: '4402',
          navn: 'Nav Arbeid og ytelser Romerike',
        },
        {
          id: '4410',
          navn: 'Nav Arbeid og ytelser Sørlandet',
        },
        {
          id: '4416',
          navn: 'Nav Arbeid og ytelser Trondheim',
        },
        {
          id: '4407',
          navn: 'Nav Arbeid og ytelser Tønsberg',
        },
        {
          id: '4476',
          navn: 'Uføretrygd med utlandstilsnitt',
        },
        {
          id: '4475',
          navn: 'Uføretrygd bosatt utland',
        },
        {
          id: '4483',
          navn: 'Nav Arbeid og ytelser Egne ansatte',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '4293',
          navn: 'Nav Klageinstans øst',
        },
        {
          id: '4294',
          navn: 'Nav Klageinstans vest',
        },
        {
          id: '4295',
          navn: 'Nav Klageinstans nord',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_12_2',
          navn: 'Ftrl - § 12-2',
          beskrivelse: 'Folketrygdloven - § 12-2',
        },
        {
          id: 'FTRL_12_2_12_8',
          navn: 'Ftrl - § 12-2 / § 12-8',
          beskrivelse: 'Folketrygdloven - § 12-2 / § 12-8',
        },
        {
          id: 'FTRL_12_2_6_57',
          navn: 'Ftrl - § 12-2 art 6 og 57 (EØS)',
          beskrivelse: 'Folketrygdloven - § 12-2 art 6 og 57 (EØS)',
        },
        {
          id: 'FTRL_12_2_TRYGDEAVTALE',
          navn: 'Ftrl - § 12-2 Trygdeavtale',
          beskrivelse: 'Folketrygdloven - § 12-2 Trygdeavtale',
        },
        {
          id: 'FTRL_12_3',
          navn: 'Ftrl - § 12-3',
          beskrivelse: 'Folketrygdloven - § 12-3',
        },
        {
          id: 'FTRL_12_3_EOES',
          navn: 'Ftrl - § 12-3 EØS',
          beskrivelse: 'Folketrygdloven - § 12-3 EØS',
        },
        {
          id: 'FTRL_12_3_TRYGDEAVTALE',
          navn: 'Ftrl - § 12-3 Trygdeavtale',
          beskrivelse: 'Folketrygdloven - § 12-3 Trygdeavtale',
        },
        {
          id: 'FTRL_12_5',
          navn: 'Ftrl - § 12-5',
          beskrivelse: 'Folketrygdloven - § 12-5',
        },
        {
          id: 'FTRL_12_6',
          navn: 'Ftrl - § 12-6',
          beskrivelse: 'Folketrygdloven - § 12-6',
        },
        {
          id: 'FTRL_12_7_12_9_12_10',
          navn: 'Ftrl - § 12-7 / § 12-9 / § 12-10',
          beskrivelse: 'Folketrygdloven - § 12-7 / § 12-9 / § 12-10',
        },
        {
          id: 'FTRL_12_8',
          navn: 'Ftrl - § 12-8',
          beskrivelse: 'Folketrygdloven - § 12-8',
        },
        {
          id: 'FTRL_12_8_UNG_UFOER',
          navn: 'Ftrl - § 12-8 Ung ufør',
          beskrivelse: 'Folketrygdloven - § 12-8 Ung ufør',
        },
        {
          id: 'FTRL_12_11_12_12_12_13_BEREGNING',
          navn: 'Ftrl - § 12-11 / § 12-12 / § 12-13, Beregning',
          beskrivelse: 'Folketrygdloven - § 12-11 / § 12-12 / § 12-13, Beregning',
        },
        {
          id: 'FTRL_12_11_12_12_12_13_ART_52',
          navn: 'Ftrl - § 12-11 / § 12-12 / § 12-13, Art 52 (EØS)',
          beskrivelse: 'Folketrygdloven - § 12-11 / § 12-12 / § 12-13, Art 52 (EØS)',
        },
        {
          id: 'FTRL_12_11_12_12_12_13_TRYGDEAVTALE',
          navn: 'Ftrl - § 12-11 / § 12-12 / § 12-13, Trygdeavtale',
          beskrivelse: 'Folketrygdloven - § 12-11 / § 12-12 / § 12-13, Trygdeavtale',
        },
        {
          id: 'FTRL_12_13_SIVILSTAND',
          navn: 'Ftrl - § 12-13 Sivilstand',
          beskrivelse: 'Folketrygdloven - § 12-13 Sivilstand',
        },
        {
          id: 'FTRL_12_13_UNG_UFOER',
          navn: 'Ftrl - § 12-13 Ung ufør',
          beskrivelse: 'Folketrygdloven - § 12-13 Ung ufør',
        },
        {
          id: 'FTRL_12_14_EO',
          navn: 'Ftrl - § 12-14 EO',
          beskrivelse: 'Folketrygdloven - § 12-14 EO',
        },
        {
          id: 'FTRL_12_14_INNTEKTSENDRING',
          navn: 'Ftrl - § 12-14 inntektsendring',
          beskrivelse: 'Folketrygdloven - § 12-14 inntektsendring',
        },
        {
          id: 'FTRL_12_15',
          navn: 'Ftrl - § 12-15',
          beskrivelse: 'Folketrygdloven - § 12-15',
        },
        {
          id: 'FTRL_12_16',
          navn: 'Ftrl - § 12-16',
          beskrivelse: 'Folketrygdloven - § 12-16',
        },
        {
          id: 'FTRL_12_17',
          navn: 'Ftrl - § 12-17',
          beskrivelse: 'Folketrygdloven - § 12-17',
        },
        {
          id: 'FTRL_12_19',
          navn: 'Ftrl - § 12-19',
          beskrivelse: 'Folketrygdloven - § 12-19',
        },
        {
          id: 'FTRL_12_20',
          navn: 'Ftrl - § 12-20',
          beskrivelse: 'Folketrygdloven - § 12-20',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'FTRL_22_12_FVL_35_C',
          navn: 'Ftrl - § 22-12 / fvl § 35 c',
          beskrivelse: 'Folketrygdloven - § 22-12 / fvl § 35 c',
        },
        {
          id: 'FTRL_22_12_22_13',
          navn: 'Ftrl - § 22-12 / § 22-13',
          beskrivelse: 'Folketrygdloven - § 22-12 / § 22-13',
        },
        {
          id: '1000.022.015',
          navn: 'Ftrl - § 22-15',
          beskrivelse: 'Folketrygdloven - § 22-15',
        },
        {
          id: 'FTRL_22_17',
          navn: 'Ftrl - § 22-17',
          beskrivelse: 'Folketrygdloven - § 22-17',
        },
        {
          id: 'FVL_35_C_UGUNST',
          navn: 'Fvl - § 35 c ugunst',
          beskrivelse: 'Forvaltningsloven - § 35 c ugunst',
        },
        {
          id: 'FVL_35_OMGJOERING',
          navn: 'Fvl - § 35 - Krav om omgjøring',
          beskrivelse: 'Forvaltningsloven - § 35 - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '37',
      navn: 'Yrkesskade - Menerstatning',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: 'FTRL_13_0B',
              navn: '§ 13-0 forenklet o-brev',
            },
            {
              id: 'FTRL_13_0',
              navn: '§ 13-0 prosjekt',
            },
            {
              id: 'FTRL_13_0C',
              navn: '§ 13-0 uten o-brev',
            },
            {
              id: 'FTRL_13_0A',
              navn: '§ 13-0 vanlig o-brev',
            },
            {
              id: '316',
              navn: '§ 13-2',
            },
            {
              id: '317',
              navn: '§ 13-3 første, tredje og fjerde ledd',
            },
            {
              id: '318',
              navn: '§ 13-3 andre ledd',
            },
            {
              id: '866',
              navn: '§ 13-3 - Følgeskade',
            },
            {
              id: '332',
              navn: '§ 13-4',
            },
            {
              id: '867',
              navn: '§ 13-4 - Følgeskade',
            },
            {
              id: '319',
              navn: '§ 13-5',
            },
            {
              id: '320',
              navn: '§ 13-6',
            },
            {
              id: '321',
              navn: '§ 13-7',
            },
            {
              id: '322',
              navn: '§ 13-8',
            },
            {
              id: '324',
              navn: '§ 13-10',
            },
            {
              id: '327',
              navn: '§ 13-13',
            },
            {
              id: '328',
              navn: '§ 13-14',
            },
            {
              id: '333',
              navn: '§ 13-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '334',
              navn: '§ 22-10',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_13_3_1',
          navn: 'Ftrl - § 13-3 første ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 første ledd',
        },
        {
          id: 'FTRL_13_3_2',
          navn: 'Ftrl - § 13-3 andre ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 andre ledd',
        },
        {
          id: 'FTRL_13_3_FS',
          navn: 'Ftrl - § 13-3 - Følgeskade',
          beskrivelse: 'Folketrygdloven - § 13-3 - Følgeskade',
        },
        {
          id: 'FTRL_13_4',
          navn: 'Ftrl - § 13-4',
          beskrivelse: 'Folketrygdloven - § 13-4',
        },
        {
          id: 'FTRL_13_6',
          navn: 'Ftrl - § 13-6',
          beskrivelse: 'Folketrygdloven - § 13-6',
        },
        {
          id: 'FTRL_13_8',
          navn: 'Ftrl - § 13-8',
          beskrivelse: 'Folketrygdloven - § 13-8',
        },
        {
          id: 'FTRL_13_10',
          navn: 'Ftrl - § 13-10',
          beskrivelse: 'Folketrygdloven - § 13-10',
        },
        {
          id: 'FTRL_13_17',
          navn: 'Ftrl - § 13-17',
          beskrivelse: 'Folketrygdloven - § 13-17',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '36',
      navn: 'Yrkesskade - Yrkesskade',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: 'FTRL_13_0B',
              navn: '§ 13-0 forenklet o-brev',
            },
            {
              id: 'FTRL_13_0',
              navn: '§ 13-0 prosjekt',
            },
            {
              id: 'FTRL_13_0C',
              navn: '§ 13-0 uten o-brev',
            },
            {
              id: 'FTRL_13_0A',
              navn: '§ 13-0 vanlig o-brev',
            },
            {
              id: '316',
              navn: '§ 13-2',
            },
            {
              id: '317',
              navn: '§ 13-3 første, tredje og fjerde ledd',
            },
            {
              id: '318',
              navn: '§ 13-3 andre ledd',
            },
            {
              id: '866',
              navn: '§ 13-3 - Følgeskade',
            },
            {
              id: '332',
              navn: '§ 13-4',
            },
            {
              id: '867',
              navn: '§ 13-4 - Følgeskade',
            },
            {
              id: '319',
              navn: '§ 13-5',
            },
            {
              id: '320',
              navn: '§ 13-6',
            },
            {
              id: '321',
              navn: '§ 13-7',
            },
            {
              id: '322',
              navn: '§ 13-8',
            },
            {
              id: '324',
              navn: '§ 13-10',
            },
            {
              id: '327',
              navn: '§ 13-13',
            },
            {
              id: '328',
              navn: '§ 13-14',
            },
            {
              id: '333',
              navn: '§ 13-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '334',
              navn: '§ 22-10',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '4833',
          navn: 'Nav Familie- og pensjonsytelser Oslo 1',
        },
        {
          id: '4849',
          navn: 'Nav Familie- og pensjonsytelser Tromsø',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_13_3_1',
          navn: 'Ftrl - § 13-3 første ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 første ledd',
        },
        {
          id: 'FTRL_13_3_2',
          navn: 'Ftrl - § 13-3 andre ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 andre ledd',
        },
        {
          id: 'FTRL_13_3_FS',
          navn: 'Ftrl - § 13-3 - Følgeskade',
          beskrivelse: 'Folketrygdloven - § 13-3 - Følgeskade',
        },
        {
          id: 'FTRL_13_4',
          navn: 'Ftrl - § 13-4',
          beskrivelse: 'Folketrygdloven - § 13-4',
        },
        {
          id: 'FTRL_13_6',
          navn: 'Ftrl - § 13-6',
          beskrivelse: 'Folketrygdloven - § 13-6',
        },
        {
          id: 'FTRL_13_8',
          navn: 'Ftrl - § 13-8',
          beskrivelse: 'Folketrygdloven - § 13-8',
        },
        {
          id: 'FTRL_13_10',
          navn: 'Ftrl - § 13-10',
          beskrivelse: 'Folketrygdloven - § 13-10',
        },
        {
          id: 'FTRL_13_17',
          navn: 'Ftrl - § 13-17',
          beskrivelse: 'Folketrygdloven - § 13-17',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
    {
      id: '38',
      navn: 'Yrkesskade - Yrkessykdom',
      lovKildeToRegistreringshjemler: [
        {
          lovkilde: {
            id: '1',
            navn: 'Folketrygdloven',
            beskrivelse: 'Ftrl',
          },
          registreringshjemler: [
            {
              id: 'FTRL_13_0B',
              navn: '§ 13-0 forenklet o-brev',
            },
            {
              id: 'FTRL_13_0',
              navn: '§ 13-0 prosjekt',
            },
            {
              id: 'FTRL_13_0C',
              navn: '§ 13-0 uten o-brev',
            },
            {
              id: 'FTRL_13_0A',
              navn: '§ 13-0 vanlig o-brev',
            },
            {
              id: '316',
              navn: '§ 13-2',
            },
            {
              id: '317',
              navn: '§ 13-3 første, tredje og fjerde ledd',
            },
            {
              id: '318',
              navn: '§ 13-3 andre ledd',
            },
            {
              id: '866',
              navn: '§ 13-3 - Følgeskade',
            },
            {
              id: '332',
              navn: '§ 13-4',
            },
            {
              id: '867',
              navn: '§ 13-4 - Følgeskade',
            },
            {
              id: '319',
              navn: '§ 13-5',
            },
            {
              id: '320',
              navn: '§ 13-6',
            },
            {
              id: '321',
              navn: '§ 13-7',
            },
            {
              id: '322',
              navn: '§ 13-8',
            },
            {
              id: '324',
              navn: '§ 13-10',
            },
            {
              id: '327',
              navn: '§ 13-13',
            },
            {
              id: '328',
              navn: '§ 13-14',
            },
            {
              id: '333',
              navn: '§ 13-17',
            },
            {
              id: '108',
              navn: '§ 21-3',
            },
            {
              id: '109',
              navn: '§ 21-7',
            },
            {
              id: '112',
              navn: '§ 21-12',
            },
            {
              id: '334',
              navn: '§ 22-10',
            },
            {
              id: '114',
              navn: '§ 22-13',
            },
            {
              id: '115',
              navn: '§ 22-14',
            },
            {
              id: '144',
              navn: '§ 22-15 første ledd første punktum',
            },
            {
              id: '145',
              navn: '§ 22-15 første ledd andre punktum',
            },
            {
              id: '146',
              navn: '§ 22-15 andre ledd',
            },
            {
              id: '268',
              navn: '§ 22-15 tredje ledd',
            },
            {
              id: '147',
              navn: '§ 22-15 fjerde ledd',
            },
            {
              id: '148',
              navn: '§ 22-15 femte ledd',
            },
            {
              id: '149',
              navn: '§ 22-15 sjette ledd',
            },
            {
              id: '150',
              navn: '§ 22-17a',
            },
          ],
        },
        {
          lovkilde: {
            id: '8',
            navn: 'Forvaltningsloven',
            beskrivelse: 'Fvl',
          },
          registreringshjemler: [
            {
              id: '117',
              navn: '§ 11',
            },
            {
              id: '119',
              navn: '§ 16',
            },
            {
              id: '120',
              navn: '§ 17',
            },
            {
              id: '121',
              navn: '§§ 18 og 19',
            },
            {
              id: '122',
              navn: '§ 21',
            },
            {
              id: '126',
              navn: '§ 29',
            },
            {
              id: '127',
              navn: '§ 30',
            },
            {
              id: '128',
              navn: '§ 31',
            },
            {
              id: '129',
              navn: '§ 32',
            },
            {
              id: '130',
              navn: '§ 33',
            },
            {
              id: '131',
              navn: '§ 35',
            },
          ],
        },
        {
          lovkilde: {
            id: '9',
            navn: 'Trygderettsloven',
            beskrivelse: 'Trrl',
          },
          registreringshjemler: [
            {
              id: '135',
              navn: '§ 9',
            },
            {
              id: '136',
              navn: '§ 10',
            },
          ],
        },
      ],
      enheter: [
        {
          id: '4803',
          navn: 'Nav Familie- og pensjonsytelser Oslo 2',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      klageenheter: [
        {
          id: '4291',
          navn: 'Nav Klageinstans Oslo og Akershus',
        },
        {
          id: '4292',
          navn: 'Nav Klageinstans Midt-Norge',
        },
        {
          id: '2103',
          navn: 'Nav Vikafossen',
        },
      ],
      innsendingshjemler: [
        {
          id: 'FTRL_13_3_1',
          navn: 'Ftrl - § 13-3 første ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 første ledd',
        },
        {
          id: 'FTRL_13_3_2',
          navn: 'Ftrl - § 13-3 andre ledd',
          beskrivelse: 'Folketrygdloven - § 13-3 andre ledd',
        },
        {
          id: 'FTRL_13_3_FS',
          navn: 'Ftrl - § 13-3 - Følgeskade',
          beskrivelse: 'Folketrygdloven - § 13-3 - Følgeskade',
        },
        {
          id: 'FTRL_13_4',
          navn: 'Ftrl - § 13-4',
          beskrivelse: 'Folketrygdloven - § 13-4',
        },
        {
          id: 'FTRL_13_6',
          navn: 'Ftrl - § 13-6',
          beskrivelse: 'Folketrygdloven - § 13-6',
        },
        {
          id: 'FTRL_13_8',
          navn: 'Ftrl - § 13-8',
          beskrivelse: 'Folketrygdloven - § 13-8',
        },
        {
          id: 'FTRL_13_10',
          navn: 'Ftrl - § 13-10',
          beskrivelse: 'Folketrygdloven - § 13-10',
        },
        {
          id: 'FTRL_13_17',
          navn: 'Ftrl - § 13-17',
          beskrivelse: 'Folketrygdloven - § 13-17',
        },
        {
          id: 'FTRL_21_12',
          navn: 'Ftrl - § 21-12',
          beskrivelse: 'Folketrygdloven - § 21-12',
        },
        {
          id: 'TRRL_9',
          navn: 'Trrl - § 9',
          beskrivelse: 'Trygderettsloven - § 9',
        },
        {
          id: 'KRAV_OM_OMGJOERING',
          navn: 'Annet - Krav om omgjøring',
          beskrivelse: 'Annet - Krav om omgjøring',
        },
        {
          id: 'BEGJAERING_OM_GJENOPPTAK',
          navn: 'Annet - Begjæring om gjenopptak',
          beskrivelse: 'Annet - Begjæring om gjenopptak',
        },
      ],
    },
  ]);
