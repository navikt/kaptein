export class TimeoutError extends Error {
  constructor(
    message: string,
    public duration: number,
    public timeout: number,
  ) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class AbortError extends Error {
  constructor(
    message: string,
    public duration: number,
  ) {
    super(message);
    this.name = 'AbortError';
  }
}

export class ProxyError extends Error {
  constructor(
    message: string,
    public duration: number,
  ) {
    super(message);
    this.name = 'ProxyError';
  }
}
