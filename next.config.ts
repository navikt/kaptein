import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    authInterrupts: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.nav.no/klage/kaptein' : undefined,
  output: 'standalone',
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  // https://github.com/vercel/next.js/issues/86099#issuecomment-3542407508
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
