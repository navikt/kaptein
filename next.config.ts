import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    authInterrupts: true,
  },
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;
