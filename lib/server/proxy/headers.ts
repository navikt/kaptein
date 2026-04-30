import type { IncomingMessage, OutgoingHttpHeaders } from 'node:http';

export const prepareProxyHeaders = ({ host }: URL, req: Request, authorization?: string): OutgoingHttpHeaders => {
  const headers: OutgoingHttpHeaders = { host };

  const incomingHeaders = req.headers.entries();

  for (const [key, value] of incomingHeaders) {
    if (key.toLowerCase() === 'host') {
      continue;
    }

    headers[key] = value;
  }

  if (authorization !== undefined) {
    headers.authorization = authorization;
  }

  return headers;
};

export const getResponseHeaders = (res: IncomingMessage): Headers => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(res.headers)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    } else {
      headers.set(key, value);
    }
  }

  return headers;
};
