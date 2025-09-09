import { Consumer, type Message } from '@platformatic/kafka';
import client, { register } from 'prom-client';
import { requiredEnvString } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, parseTraceParent } from '@/lib/server/traceparent';

const log = getLogger('document-write-access-kafka-consumer');

type ListenerFn<T> = (message: Message<string, T | null, string, string>) => void;
type ParserFn<T> = (data: string) => T;

export class KafkaConsumer<T> {
  readonly #topic: string;
  readonly #parser: ParserFn<T>;
  readonly #consumer: Consumer<string, string, string, string>;
  #listeners: ListenerFn<T | null>[] = [];

  constructor(topic: string, parser: ParserFn<T>) {
    this.#topic = topic;
    this.#parser = parser;

    const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
      .split(',')
      .map((b) => b.trim());

    if (kafkaBrokers.length === 0) {
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

  async init(): Promise<void> {
    const { traceId, spanId } = generateTraceParent();
    log.debug(`Kafka consumer for topic "${this.#topic}" initializing...`, traceId, spanId);

    const initTimestamp = Date.now();

    try {
      log.debug('Connecting to Kafka brokers...', traceId, spanId);
      await this.#consumer.connectToBrokers();
      log.debug('Kafka consumer connected to brokers', traceId, spanId);

      log.debug('Kafka consumer joining group...', traceId, spanId);
      const groupId = await this.#consumer.joinGroup({});
      log.debug(`Kafka consumer joined group ${groupId}`, traceId, spanId, { group_id: groupId });

      log.debug('Kafka consumer starting stream...', traceId, spanId);

      // Create a consumer stream to listen for future changes.
      const stream = await this.#consumer.consume({
        autocommit: false,
        topics: ['klage.smart-document-write-access.v1'],
        sessionTimeout: 10_000,
        heartbeatInterval: 500,
        mode: 'latest',
      });

      log.info('Kafka consumer stream started', traceId, spanId);

      this.#closeStream = async () => {
        log.debug('Closing Kafka consumer stream...', traceId, spanId);
        await stream.close();
        log.debug('Kafka consumer stream closed', traceId, spanId);
        this.#closeStream = undefined;
      };

      const readyPromise = new Promise<void>((resolve) => {
        stream.once('readable', () => {
          log.debug('Kafka stream readable', traceId, spanId);
          resolve();
        });
      });

      log.debug('Kafka consumer stream listener starting...', traceId, spanId);

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
            log.debug('Received tombstone message from Kafka, deleting access list entry', message_trace_id, spanId);

            this.#notifyListeners(parsedMessage);

            return;
          }

          if (timestamp < initTimestamp) {
            return log.debug(`Received outdated message from Kafka for topic "${this.#topic}"`, traceId, spanId, {
              topic: this.#topic,
              key,
              timestamp,
            });
          }

          log.debug(`Received message from Kafka for topic "${this.#topic}"`, message_trace_id, spanId, {
            topic: this.#topic,
            key,
            timestamp,
          });

          this.#notifyListeners(parsedMessage);
        } catch (error) {
          log.error('Failed to parse Kafka message', message_trace_id, spanId, {
            topic: this.#topic,
            key,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      log.debug('Kafka consumer stream listener started', traceId, spanId);

      return readyPromise;
    } catch (error) {
      log.error('Failed to initialize Kafka consumer', traceId, spanId, {
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

    log.warn(`Smart Document Write Access is not processing - ${errors.join(', ')}`, traceId, spanId, { errors });

    return false;
  };

  public close = async () => {
    const { traceId, spanId } = generateTraceParent();

    log.debug(`Closing Kafka consumer for topic "${this.#topic}"...`, traceId, spanId, { topic: this.#topic });

    if (this.#closeStream === undefined) {
      log.debug('Kafka consumer stream not initialized, nothing to close', traceId, spanId, { topic: this.#topic });
    } else {
      await this.#closeStream?.();
    }

    log.debug('Kafka consumer leaving group...', traceId, spanId, { topic: this.#topic });
    await this.#consumer.leaveGroup();
    log.debug('Kafka consumer left group', traceId, spanId, { topic: this.#topic });

    log.debug('Kafka consumer closing...', traceId, spanId, { topic: this.#topic });
    await this.#consumer.close();
    log.debug('Kafka consumer closed', traceId, spanId, { topic: this.#topic });
  };
}
