import { createLoader, parseAsArrayOf, parseAsString } from 'nuqs/server';

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  ytelser: parseAsArrayOf(parseAsString),
  klageenheter: parseAsArrayOf(parseAsString),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
