FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:8c6b509847e5ab106cb283ffdd071da9c2c4fe360cfe186056859fe9adaadfae

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
