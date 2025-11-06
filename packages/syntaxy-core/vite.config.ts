import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SyntaxyCore',
      formats: ['es', 'umd'],
      fileName: (format) => `syntaxy-core.${format}.js`,
    },
    rollupOptions: {
      external: ['lexical'],
      output: {
        globals: {
          lexical: 'Lexical',
        },
      },
    },
    outDir: 'dist',
  },
});
