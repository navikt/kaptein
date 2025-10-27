import { describe, expect, test } from 'bun:test';
import { HjemlerModeFilter } from '@/app/query-types';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import type { BaseBehandling } from '@/lib/types';

const AB = { innsendingshjemmelIdList: ['A', 'B'] } as BaseBehandling;
const CD = { innsendingshjemmelIdList: ['C', 'D'] } as BaseBehandling;
const EF = { innsendingshjemmelIdList: ['E', 'F'] } as BaseBehandling;

const getHjemler = (b: BaseBehandling) => b.innsendingshjemmelIdList;

const LIST = [AB, CD, EF];

describe('filterHjemler', () => {
  test('Include some', () => {
    const result = filterHjemler(LIST, ['A', 'B', 'C'], HjemlerModeFilter.INCLUDE_FOR_SOME, getHjemler);

    expect(result).toContain(AB);
    expect(result).toContain(CD);
    expect(result).not.toContain(EF);
  });

  test('Include all selected', () => {
    const result = filterHjemler(LIST, ['A', 'B'], HjemlerModeFilter.INCLUDE_ALL_SELECTED, getHjemler);

    expect(result).toContain(AB);
    expect(result).not.toContain(CD);
    expect(result).not.toContain(EF);
  });

  test('Include all in behandling', () => {
    const result1 = filterHjemler(LIST, ['A', 'B', 'C'], HjemlerModeFilter.INCLUDE_ALL_IN_BEHANDLING, getHjemler);

    expect(result1).not.toContain(AB);
    expect(result1).not.toContain(CD);
    expect(result1).not.toContain(EF);

    const result2 = filterHjemler(LIST, ['A', 'B'], HjemlerModeFilter.INCLUDE_ALL_IN_BEHANDLING, getHjemler);

    expect(result2).toContain(AB);
    expect(result2).not.toContain(CD);
    expect(result2).not.toContain(EF);
  });

  test('null defaults to some', () => {
    const result = filterHjemler(LIST, ['A', 'F'], null, getHjemler);

    expect(result).toContain(AB);
    expect(result).not.toContain(CD);
    expect(result).toContain(EF);
  });

  test('No hjemler selected', () => {
    const result1 = filterHjemler(LIST, [], HjemlerModeFilter.INCLUDE_FOR_SOME, getHjemler);
    const result2 = filterHjemler(LIST, [], HjemlerModeFilter.INCLUDE_ALL_SELECTED, getHjemler);

    expect(result1).toEqual(LIST);
    expect(result2).toEqual(LIST);
  });
});
