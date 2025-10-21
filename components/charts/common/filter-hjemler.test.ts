import { describe, expect, test } from 'bun:test';
import { HjemlerModeFilter } from '@/app/query-types';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import type { BaseBehandling } from '@/lib/types';

const AB = { innsendingshjemmelIdList: ['A', 'B'] } as BaseBehandling;
const CD = { innsendingshjemmelIdList: ['C', 'D'] } as BaseBehandling;
const EF = { innsendingshjemmelIdList: ['E', 'F'] } as BaseBehandling;

const getHjemler = (b: BaseBehandling) => b.innsendingshjemmelIdList;

const BEHANDLINGER = [AB, CD, EF];

describe('filterHjemler', () => {
  test('Include some', () => {
    const result = filterHjemler(BEHANDLINGER, ['A', 'B', 'C'], HjemlerModeFilter.INCLUDE_FOR_SOME, getHjemler);

    expect(result).toContain(AB);
    expect(result).toContain(CD);
    expect(result).not.toContain(EF);
  });

  test('Include all', () => {
    const result = filterHjemler(BEHANDLINGER, ['A', 'B'], HjemlerModeFilter.INCLUDE_FOR_ALL, getHjemler);

    expect(result).toContain(AB);
    expect(result).not.toContain(CD);
    expect(result).not.toContain(EF);
  });

  test('null defaults to some', () => {
    const result = filterHjemler(BEHANDLINGER, ['A', 'F'], null, getHjemler);

    expect(result).toContain(AB);
    expect(result).not.toContain(CD);
    expect(result).toContain(EF);
  });

  test('No hjemler selected', () => {
    const result1 = filterHjemler(BEHANDLINGER, [], HjemlerModeFilter.INCLUDE_FOR_SOME, getHjemler);
    const result2 = filterHjemler(BEHANDLINGER, [], HjemlerModeFilter.INCLUDE_FOR_ALL, getHjemler);

    expect(result1).toEqual(BEHANDLINGER);
    expect(result2).toEqual(BEHANDLINGER);
  });
});
