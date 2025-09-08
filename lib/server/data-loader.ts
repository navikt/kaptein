import type { AppName } from '@/lib/server/get-obo-token';
import { type ParserFn, streamData } from '@/lib/server/stream';

export type ProgressListener = (count: number, total: number | null, progress: number) => void;

export class DataLoader<T> {
  readonly #appName: AppName;
  readonly #path: string;
  readonly #parser: ParserFn<T>;
  readonly #name: string;

  #listeners: Set<ProgressListener> = new Set();
  #count = 0;
  #total: number | null = null;
  #loader: Promise<T[]> | null = null;

  constructor(appName: AppName, path: string, parser: ParserFn<T>, name = 'Unnamed') {
    this.#appName = appName;
    this.#path = path;
    this.#parser = parser;
    this.#name = name;
  }

  public getCount = () => this.#count;
  public getTotal = () => this.#total;

  public progress(): number {
    if (this.#total === null || this.#total === 0) {
      return 0;
    }

    return (this.#count / this.#total) * 100;
  }

  public addProgressListener(listener: ProgressListener): () => void {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  public load(): Promise<T[]> {
    if (this.#loader === null) {
      this.#loader = this.#load().finally(() => {
        this.#loader = null;
      });
    }

    return this.#loader;
  }

  async #load(): Promise<T[]> {
    const start = Date.now();

    const { stream, totalCount } = await streamData(this.#appName, this.#path, this.#parser);

    this.#total = totalCount;

    const reader = stream.getReader();

    const results: T[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const { data, count, totalCount } = value;

      results.push(data);

      this.#count = count;
      this.#total = totalCount;

      this.#notifyListeners();
    }

    console.debug(`${this.#name} DataLoader: Loaded ${results.length} items in ${Date.now() - start}ms`);

    return results;
  }

  #notifyListeners() {
    const progress = this.progress();

    for (const listener of this.#listeners) {
      listener(this.#count, this.#total, progress);
    }
  }
}
