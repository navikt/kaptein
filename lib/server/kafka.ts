import { Consumer, type Message } from '@platformatic/kafka';
import client, { register } from 'prom-client';
import { requiredEnvString } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { generateSpanId, generateTraceId, generateTraceParent, parseTraceParent } from '@/lib/server/traceparent';

type ListenerFn<T> = (message: Message<string, T | null, string, string>) => void;
type ParserFn<T> = (data: string) => T;

export class KafkaConsumer<T> {
  readonly #topic: string;
  readonly #parser: ParserFn<T>;
  readonly #consumer: Consumer<string, string, string, string>;
  readonly #log: ReturnType<typeof getLogger>;
  #listeners: ListenerFn<T | null>[] = [];

  constructor(topic: string, parser: ParserFn<T>) {
    this.#topic = topic;
    this.#parser = parser;
    this.#log = getLogger(`kafka-consumer-${topic}`, { topic });

    const { traceId, spanId } = generateTraceParent();

    const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
      .split(',')
      .map((b) => b.trim());

    if (kafkaBrokers.length === 0) {
      this.#log.error('KAFKA_BROKERS must contain at least one broker', traceId, spanId);
      throw new Error('KAFKA_BROKERS must contain at least one broker');
    }

    this.#consumer = new Consumer({
      groupId: crypto.randomUUID(),
      clientId: 'kaptein',
      bootstrapBrokers: kafkaBrokers,
      tls: {
        key: requiredEnvString('KAFKA_PRIVATE_KEY'),
        cert: requiredEnvString('KAFKA_CERTIFICATE'),
        ca: requiredEnvString('KAFKA_CA'),
      },
      metrics: { registry: register, client },
      deserializers: {
        key: (data) => data?.toString('utf-8'),
        value: (data) => data?.toString('utf-8'),
        headerKey: (data) => data?.toString('utf-8'),
        headerValue: (data) => data?.toString('utf-8'),
      },
    });
  }

  #closeStream: (() => Promise<void>) | undefined;

  async init(traceId = generateTraceId()): Promise<void> {
    const spanId = generateSpanId();
    this.#log.debug(`Kafka consumer for topic '${this.#topic}' initializing...`, traceId, spanId);

    const initTimestamp = Date.now();

    try {
      this.#log.debug(`Connecting to Kafka brokers for topic '${this.#topic}'...`, traceId, spanId);
      await this.#consumer.connectToBrokers();
      this.#log.debug(`Kafka consumer connected to brokers for topic '${this.#topic}'`, traceId, spanId);

      this.#log.debug(`Kafka consumer joining group for topic '${this.#topic}'...`, traceId, spanId);
      const groupId = await this.#consumer.joinGroup({});
      this.#log.debug(`Kafka consumer joined group ${groupId} for topic '${this.#topic}'`, traceId, spanId, {
        group_id: groupId,
      });

      this.#log.debug('Kafka consumer starting stream...', traceId, spanId);

      // Create a consumer stream to listen for future changes.
      const stream = await this.#consumer.consume({
        autocommit: false,
        topics: [this.#topic],
        sessionTimeout: 10_000,
        heartbeatInterval: 500,
        mode: 'latest',
      });

      this.#log.info(`Kafka consumer stream started for topic '${this.#topic}'`, traceId, spanId);

      this.#closeStream = async () => {
        this.#log.debug(`Closing Kafka consumer stream  for topic '${this.#topic}'...`, traceId, spanId);
        await stream.close();
        this.#log.debug(`Kafka consumer stream closed for topic '${this.#topic}'`, traceId, spanId);
        this.#closeStream = undefined;
      };

      const readyPromise = new Promise<void>((resolve) => {
        stream.once('readable', () => {
          this.#log.debug(`Kafka stream readable for topic '${this.#topic}'`, traceId, spanId);
          resolve();
        });
      });

      this.#log.debug(`Kafka consumer stream listener starting for topic '${this.#topic}'...`, traceId, spanId);

      stream.on('data', (message) => {
        const { key, value, headers, timestamp } = message;
        const traceparent = headers.get('traceparent');

        const message_trace_id =
          traceparent === undefined ? traceId : (parseTraceParent(traceparent)?.traceId ?? traceId);

        try {
          const payload = this.#parser(value);

          const parsedMessage: Message<string, T, string, string> = {
            ...message,
            value: payload,
          };

          if (payload === null) {
            this.#log.debug(
              `Received tombstone message from Kafka, deleting access list entry for topic '${this.#topic}'`,
              message_trace_id,
              spanId,
            );

            this.#notifyListeners(parsedMessage);

            return;
          }

          if (timestamp < initTimestamp) {
            return this.#log.debug(`Received outdated message from Kafka for topic '${this.#topic}'`, traceId, spanId, {
              key,
            });
          }

          this.#log.debug(`Received message from Kafka for topic '${this.#topic}'`, message_trace_id, spanId, {
            key,
          });

          this.#notifyListeners(parsedMessage);
        } catch (error) {
          this.#log.error(
            `Failed to parse Kafka message for topic '${this.#topic}': '${value}'`,
            message_trace_id,
            spanId,
            {
              key,
              error: error instanceof Error ? error.message : 'Unknown error',
              value,
            },
          );
        }
      });

      this.#log.debug(`Kafka consumer stream listener started for topic '${this.#topic}'`, traceId, spanId);

      await readyPromise;

      this.#log.debug(`Kafka consumer ready for topic '${this.#topic}'`, traceId, spanId);
    } catch (error) {
      this.#log.error(`Failed to initialize Kafka consumer for topic '${this.#topic}'`, traceId, spanId, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  #notifyListeners = (message: Message<string, T | null, string, string>) => {
    for (const listener of this.#listeners) {
      listener(message);
    }
  };

  public addListener = (listener: ListenerFn<T | null>) => {
    this.#listeners.push(listener);

    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  };

  public isProcessing = () => {
    const { traceId, spanId } = generateTraceParent();

    const errors: string[] = [];

    if (!this.#consumer.isConnected()) {
      errors.push('Kafka consumer is not connected');
    }

    if (!this.#consumer.isActive()) {
      errors.push('Kafka consumer is not active');
    }

    if (this.#closeStream === undefined) {
      errors.push('Stream is not initialized');
    }

    if (errors.length === 0) {
      // If there are no errors, we are processing.
      return true;
    }

    this.#log.warn(
      `Kafka Consumer is not processing for topic '${this.#topic}' - ${errors.join(', ')}`,
      traceId,
      spanId,
      { errors },
    );

    return false;
  };

  public close = async () => {
    const { traceId, spanId } = generateTraceParent();

    this.#log.debug(`Closing Kafka consumer for topic '${this.#topic}'...`, traceId, spanId);

    if (this.#closeStream === undefined) {
      this.#log.debug(
        `Kafka consumer stream not initialized for topic '${this.#topic}', nothing to close`,
        traceId,
        spanId,
      );
    } else {
      await this.#closeStream?.();
    }

    this.#log.debug(`Kafka consumer leaving group for topic '${this.#topic}'...`, traceId, spanId);
    await this.#consumer.leaveGroup();
    this.#log.debug(`Kafka consumer left group for topic '${this.#topic}'`, traceId, spanId);

    this.#log.debug(`Kafka consumer closing for topic '${this.#topic}'...`, traceId, spanId);
    await this.#consumer.close();
    this.#log.debug(`Kafka consumer closed for topic '${this.#topic}'`, traceId, spanId);
  };
}
