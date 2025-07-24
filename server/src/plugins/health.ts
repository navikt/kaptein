import fastifyPlugin from 'fastify-plugin';

export const HEALTH_PLUGIN_ID = 'health';

export const healthPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.get('/isAlive', (__, reply) => reply.status(200).type('text/plain').send('Alive'));
    app.get('/isReady', async (__, reply) => reply.status(200).type('text/plain').send('Ready'));

    pluginDone();
  },
  { fastify: '5', name: HEALTH_PLUGIN_ID },
);
