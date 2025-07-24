export type GenericObject = Record<string | number | symbol, unknown>;

export const isGenericObject = (obj: unknown): obj is GenericObject => typeof obj === 'object' && obj !== null;
