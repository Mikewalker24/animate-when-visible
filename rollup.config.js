import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

const output = [
  {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
  },
  {
    file: 'dist/index.mjs',
    format: 'es',
    sourcemap: true,
  },
  {
    name: 'animateWhenVisible',
    file: 'dist/index.umd.js',
    format: 'umd',
    sourcemap: true,
  },
];

const productionOutput = [
  {
    file: 'dist/index.min.js',
    format: 'es',
    sourcemap: true,
    plugins: [terser({ keep_fnames: true })],
  },
  {
    file: 'dist/index.min.mjs',
    format: 'es',
    sourcemap: true,
    plugins: [terser({ keep_fnames: true })],
  },
  {
    name: 'animateWhenVisible',
    file: 'dist/index.umd.min.js',
    format: 'umd',
    sourcemap: true,
    plugins: [terser({ keep_fnames: true })],
  },
];

export default {
  input: 'src/index.js',
  output: isProduction ? [...output, ...productionOutput] : output,
};