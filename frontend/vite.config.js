import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: parseInt(env.PORT) || 4173,
      host: '0.0.0.0',
    },
    preview: {
      port: 4173,
      host: '0.0.0.0',
      allowedHosts: ['frontend-production-39fb.up.railway.app', 'www.bogdanbeyn.online'],
  },
    plugins: [react()],
  };
});
