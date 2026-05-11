import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled']
    },
    optimizeDeps: {
      force: true,
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/material/styles',
        '@mui/icons-material/MenuRounded'
      ]
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_PROXY_TARGET || 'https://api.supernal.in',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
