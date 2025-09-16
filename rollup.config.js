import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js', // ESM build
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    terser({
      keep_fnames: true, // preserves function names for easier debugging
    }),
  ],
};
