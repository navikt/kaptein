'use client';

const privateEventTarget = new EventTarget();
export const cacheEventTargetData = new EventTarget();
export const cacheEventTargetError = new EventTarget();

export class ClientCache<T> {
  private cache: T | null = null;
  public isLoading = false;

  constructor(
    private pathname: string,
    private options?: RequestInit,
  ) {}

  private fetch = async () => {
    this.isLoading = true;

    try {
      const res = await fetch(this.pathname, this.options);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.length === 0 ? `${res.status}` : `${res.status}: ${text}`);
      }

      const data: T = await res.json();

      this.cache = data;
      privateEventTarget.dispatchEvent(new CustomEvent(this.pathname, { detail: data }));

      return data;
    } finally {
      this.isLoading = false;
    }
  };

  public getData = async () => {
    if (this.cache !== null) {
      return this.onChange(this.cache);
    }

    if (!this.isLoading) {
      try {
        const data = await this.fetch();
        return this.onChange(data);
      } catch (error) {
        this.onError(error instanceof Error ? error.message : 'Ukjent feil');
      }
    }

    const listener = (event: Event) => {
      privateEventTarget.removeEventListener(this.pathname, listener);

      this.onChange((event as CustomEvent).detail);
    };

    privateEventTarget.addEventListener(this.pathname, listener);
  };

  public refresh = async () => {
    this.cache = null;

    this.onChange(null);
    this.onChange(await this.fetch());
  };

  private onChange = async (detail: T | null) => {
    cacheEventTargetData.dispatchEvent(new CustomEvent(this.pathname, { detail }));
  };

  private onError = async (detail: string | null) => {
    cacheEventTargetError.dispatchEvent(new CustomEvent(this.pathname, { detail }));
  };
}
