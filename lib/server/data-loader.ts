import { isLocal } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import type { AppName } from '@/lib/server/get-obo-token';
import { KafkaConsumer } from '@/lib/server/kafka';
import { type ParserFn, streamData } from '@/lib/server/stream';
import { generateSpanId, generateTraceId, generateTraceParent } from '@/lib/server/traceparent';

export type ProgressListener = (count: number, total: number | null, progress: number) => void;
export type DataListener<T> = (data: T[]) => void;
export type HasKeyFn<T> = (item: T, key: string) => boolean;

export class DataLoader<T> {
  readonly #appName: AppName;
  readonly #path: string;
  readonly #parser: ParserFn<T>;
  readonly #name: string;
  readonly #hasKey: HasKeyFn<T>;
  readonly #log: ReturnType<typeof getLogger>;

  #isInitialized = false;
  #progressListeners: Set<ProgressListener> = new Set();
  #dataListeners: Set<DataListener<T>> = new Set();
  #count = 0;
  #initialTotal: number | null = null;
  #data: T[] = [];
  #loader: Promise<T[]> | null = null;

  constructor(appName: AppName, path: string, parser: ParserFn<T>, hasKey: HasKeyFn<T>, name = 'Unnamed') {
    this.#appName = appName;
    this.#path = path;
    this.#parser = parser;
    this.#name = name;
    this.#hasKey = hasKey;
    this.#log = getLogger(`dataloader-${name.toLowerCase()}`);
  }

  #startKafka = (traceId: string) => {
    const spanId = generateSpanId();
    const kafkaConsumer = new KafkaConsumer('klage.kaptein-behandling.v1', this.#parser);

    kafkaConsumer.addListener(({ key, value }) => {
      if (value === null) {
        this.#data = this.#data.filter((entry) => !this.#hasKey(entry, key));
        this.#count = this.#data.length;
        this.#notifyListeners();
        return;
      }

      let found = false;

      for (let i = this.#data.length - 1; i >= 0; i--) {
        if (this.#hasKey(this.#data[i], key)) {
          this.#data[i] = value;
          found = true;
          break;
        }
      }

      if (!found) {
        this.#data.push(value);
        this.#count = this.#data.length;
      }

      this.#notifyListeners();
    });

    this.#log.debug(`${this.#name} DataLoader: Kafka consumer started`, traceId, spanId);
  };

  public init = async () => {
    const { traceId, spanId } = generateTraceParent();

    if (this.#isInitialized) {
      this.#log.debug(`${this.#name} DataLoader: Already initialized`, traceId, spanId);
      return;
    }

    this.#isInitialized = true;
    this.#log.debug(`${this.#name} DataLoader: Initialization started`, traceId, spanId);
    await this.load(traceId);

    if (!isLocal) {
      // Kafka is not reachable outside NAIS.
      this.#startKafka(traceId);
    }

    this.#log.debug(`${this.#name} DataLoader: Initialization completed`, traceId, spanId);
  };

  public getData = () => this.#data;
  public getCount = () => this.#count;
  public getInitalTotal = () => this.#initialTotal;

  public getInitProgress(): number {
    if (this.#initialTotal === null || this.#initialTotal === 0) {
      return 0;
    }

    return (this.#count / this.#initialTotal) * 100;
  }

  public addInitProgressListener(listener: ProgressListener): () => void {
    this.#progressListeners.add(listener);

    return () => {
      this.#progressListeners.delete(listener);
    };
  }

  /**
   * Listener for data changes, called whenever data is added, updated or removed.
   * On every change, the entire data set is sent to the listener.
   */
  public addDataListener(listener: DataListener<T>): () => void {
    this.#dataListeners.add(listener);

    return () => {
      this.#dataListeners.delete(listener);
    };
  }

  public isInitialized = () => this.#isInitialized;
  public isReady = () => this.#isInitialized && this.#loader === null;

  public async load(traceId: string = generateTraceId()): Promise<T[]> {
    const spanId = generateSpanId();
    this.#log.debug(`${this.#name} DataLoader: Loading data from ${this.#path}`, traceId, spanId);

    const start = Date.now();

    const { stream, totalCount } = await streamData(this.#appName, this.#path, this.#parser);

    this.#initialTotal = totalCount;

    const reader = stream.getReader();

    const results: T[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const { data, count, totalCount } = value;

      results.push(...data);

      this.#data = results;
      this.#count = count;
      this.#initialTotal = totalCount;

      this.#notifyListeners();
    }

    this.#log.debug(
      `${this.#name} DataLoader: Loaded ${results.length} items in ${Date.now() - start}ms`,
      traceId,
      spanId,
    );

    this.#loader = null;

    return results;
  }

  #notifyListeners() {
    for (const listener of this.#dataListeners) {
      listener(this.#data);
    }

    const progress = this.getInitProgress();

    for (const listener of this.#progressListeners) {
      listener(this.#count, this.#initialTotal, progress);
    }
  }
}
