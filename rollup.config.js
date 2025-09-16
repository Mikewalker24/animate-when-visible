import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.mjs', // ES module
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.js', // UMD for browsers
      format: 'umd',
      name: 'animateWhenVisible',
      sourcemap: true,
    },
  ],
  plugins: [
    terser({
      keep_fnames: true,
    }),
  ],
};
