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
      name: 'SyntaxyExtensionBold',
      formats: ['es', 'umd'],
      fileName: (format) => `syntaxy-extension-bold.${format}.js`,
    },
    rollupOptions: {
      external: ['lexical', '@syntaxy/core'],
      output: {
        globals: {
          lexical: 'Lexical',
          '@syntaxy/core': 'SyntaxyCore',
        },
      },
    },
    outDir: 'dist',
  },
});
