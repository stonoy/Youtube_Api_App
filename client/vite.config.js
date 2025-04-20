import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env from the root of the project (one level up from `client/`)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_ACCESS_TOKEN': JSON.stringify(env.VITE_ACCESS_TOKEN),
    },
  };
});
