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
      name: 'SyntaxyVanilla',
      formats: ['es', 'umd'],
      fileName: (format) => `syntaxy-vanilla.${format}.js`,
    },
    rollupOptions: {
      external: ['lexical', /@lexical\/.*/, '@syntaxy/core'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@syntaxy/core': 'SyntaxyCore',
        },
      },
    },
    outDir: 'dist',
  },
});
