FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:b6de72bbdd0eb8838192d028d7725a4dc047db3f28f79ad6ad2bd88294f06c37

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
