import { isDeployed } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import type { AppName } from '@/lib/server/get-obo-token';
import { KafkaConsumer } from '@/lib/server/kafka';
import { type ParserFn, streamData } from '@/lib/server/stream';
import { generateSpanId, generateTraceId, generateTraceParent } from '@/lib/server/traceparent';

export type ProgressListener = (count: number, total: number | null, progress: number) => void;
export type DataListener<T> = (data: T[]) => void;
export type HasKeyFn<T> = (item: T, key: string) => boolean;

export class DataLoader<T> {
  readonly name: string;
  readonly #appName: AppName;
  readonly #path: string;
  readonly #parser: ParserFn<T>;
  readonly #hasKey: HasKeyFn<T>;
  readonly #kafkaTopic: string | undefined;
  readonly #log: ReturnType<typeof getLogger>;
  readonly #instanceId: string = crypto.randomUUID();

  #isInitialized = false;
  #progressListeners: Set<ProgressListener> = new Set();
  #dataListeners: Set<DataListener<T>> = new Set();
  #count = 0;
  #initialTotal: number | null = null;
  #data: T[] = [];
  #loader: Promise<T[]> | null = null;
  #kafkaConsumer: KafkaConsumer<T> | null = null;

  constructor(
    appName: AppName,
    path: string,
    parser: ParserFn<T>,
    hasKey: HasKeyFn<T>,
    kafkaTopic?: string,
    name = 'Unnamed',
  ) {
    this.#appName = appName;
    this.#path = path;
    this.#parser = parser;
    this.name = name;
    this.#hasKey = hasKey;
    this.#kafkaTopic = kafkaTopic;
    this.#log = getLogger(`dataloader-${name.toLowerCase()}`, {
      app_name: appName,
      path,
      topic: kafkaTopic,
      instance_id: this.#instanceId,
      name,
    });

    this.#log.debug(
      `${this.name} DataLoader: instance created (${this.#instanceId})`,
      generateTraceId(),
      generateSpanId(),
    );
  }

  #startKafka = async (kafkaTopic: string, traceId: string) => {
    const spanId = generateSpanId();
    this.#log.debug(`${this.name} DataLoader: Kafka consumer starting with topic "${kafkaTopic}"...`, traceId, spanId);

    try {
      this.#kafkaConsumer = new KafkaConsumer(kafkaTopic, this.#parser);
    } catch (error) {
      this.#log.error(
        `${this.name} DataLoader: Failed to create Kafka consumer for topic '${kafkaTopic}'`,
        traceId,
        spanId,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      );

      throw error;
    }

    this.#kafkaConsumer.addListener(({ key, value }) => {
      if (value === null) {
        this.#data = this.#data.filter((entry) => !this.#hasKey(entry, key));
        this.#count = this.#data.length;
        this.#notifyListeners();
        return;
      }

      let found = false;

      const start = performance.now();

      for (let i = this.#data.length - 1; i >= 0; i--) {
        if (this.#hasKey(this.#data[i], key)) {
          this.#data[i] = value;
          found = true;

          const duration = performance.now() - start;

          this.#log.debug(
            `${this.name} DataLoader: Kafka consumer looked through ${this.#data.length - i} items in ${duration}ms`,
            traceId,
            spanId,
            {
              duration,
            },
          );

          break;
        }
      }

      if (!found) {
        const duration = performance.now() - start;
        this.#log.debug(
          `${this.name} DataLoader: Kafka consumer looked through ${this.#data.length} items in ${duration}ms`,
          traceId,
          spanId,
          {
            duration,
          },
        );

        this.#log.debug(`${this.name} DataLoader: New item added via Kafka`, traceId, spanId);
        this.#data.push(value);
        this.#count = this.#data.length;
      } else {
        this.#log.debug(`${this.name} DataLoader: Item updated via Kafka`, traceId, spanId);
      }

      this.#notifyListeners();
    });

    await this.#kafkaConsumer.init(traceId);

    this.#log.debug(`${this.name} DataLoader: Kafka consumer started`, traceId, spanId);
  };

  public init = async () => {
    const { traceId, spanId } = generateTraceParent();

    if (this.#isInitialized === true) {
      this.#log.debug(`${this.name} DataLoader: Already initialized`, traceId, spanId);
      return;
    }

    this.#isInitialized = true;
    this.#log.debug(`${this.name} DataLoader: Initialization started`, traceId, spanId);

    await this.#load(traceId);

    if (isDeployed && this.#kafkaTopic !== undefined) {
      // Kafka is not reachable outside NAIS.
      await this.#startKafka(this.#kafkaTopic, traceId);
    }

    this.#log.debug(`${this.name} DataLoader: Initialization completed`, traceId, spanId);
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

    return () => this.removeDataListener(listener);
  }

  public removeDataListener(listener: DataListener<T>): void {
    this.#dataListeners.delete(listener);
  }

  public isReady(traceId = generateTraceId()) {
    const spanId = generateSpanId();

    const errors: string[] = [];

    if (this.#isInitialized === false) {
      errors.push('Not initialized');
    }

    if (this.#loader !== null) {
      errors.push('Still loading data');
    }

    if (this.#kafkaTopic !== undefined) {
      if (this.#kafkaConsumer === null) {
        errors.push('Kafka not initialized');
      } else if (!this.#kafkaConsumer.isProcessing()) {
        errors.push('Kafka not processing');
      }
    }

    if (errors.length === 0) {
      return true;
    }

    this.#log.warn(`${this.name} DataLoader is not ready - ${errors.join(', ')}`, traceId, spanId);
  }

  async #load(traceId: string = generateTraceId()): Promise<T[]> {
    const spanId = generateSpanId();
    this.#log.debug(`${this.name} DataLoader: Loading data from ${this.#appName}/${this.#path}`, traceId, spanId);

    const start = performance.now();

    const { stream, totalCount } = await streamData(this.#appName, this.#path, this.#parser);

    this.#initialTotal = totalCount;

    this.#notifyProgressListeners();

    const progressRateLimit = totalCount === null ? 1 : Math.max(1, Math.floor(totalCount / 200));

    const reader = stream.getReader();

    const results: T[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const { data, count } = value;

      results.push(data);

      this.#data = results;
      this.#count = count;

      // Rate limit progress notifications
      if (count === this.#initialTotal || count % progressRateLimit === 0) {
        this.#notifyProgressListeners();
      }
    }

    this.#log.debug(
      `${this.name} DataLoader: Loaded ${results.length} items in ${performance.now() - start}ms`,
      traceId,
      spanId,
    );

    this.#loader = null;
    this.#notifyListeners();

    return results;
  }

  #notifyListeners() {
    for (const listener of this.#dataListeners) {
      listener(this.#data);
    }
  }

  #notifyProgressListeners() {
    const progress = this.getInitProgress();

    for (const listener of this.#progressListeners) {
      listener(this.#count, this.#initialTotal, progress);
    }
  }
}
