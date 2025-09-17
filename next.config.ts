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
};

export default nextConfig;
