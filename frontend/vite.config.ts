import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-oxc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const PROXY = {
  target: 'https://kaptein.intern.dev.nav.no',
  changeOrigin: true,
};

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 8065,
    proxy: {
      '/api': PROXY,
      '/version': PROXY,
      '/oauth': PROXY,
    },
  },
});
