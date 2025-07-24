/**
 * Parse a query string into an object.
 * @param query `foo=bar&baz=abc,123`
 * @returns `{ foo: 'bar', baz: 'abc,123' }`
 */
export const querystringParser = (query: string): Record<string, string | undefined> =>
  query.split('&').reduce<Record<string, string | undefined>>((acc, q) => {
    const [key, value] = q.split('=');

    if (key === undefined || value === undefined) {
      return acc;
    }

    acc[key] = value;

    return acc;
  }, {});
