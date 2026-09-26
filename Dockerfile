FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim@sha256:c8502f416037f7971f8221718ad8717eed2d082649e8a14b21b9c3cb1b8ac06a

WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

COPY .next/standalone ./
COPY public ./public
COPY .next/static ./.next/static

ARG VERSION
ENV VERSION=$VERSION

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["server.js"]
