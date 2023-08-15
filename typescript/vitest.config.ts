import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    includeSource: ['src/**/*.ts'],
    include: ['src/**/*.test.ts'],
    
  },
  plugins: [tsconfigPaths()],
  define: {
    'import.meta.vitest': undefined,
  },
});
