import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

const outputs = [
  {
    file: 'dist/index.js', // unminified ES module
    format: 'es',
    sourcemap: false,
  },
];

if (isProduction) {
  outputs.push({
    file: 'dist/index.umd.min.js', // minified UMD for browsers
    format: 'umd',
    name: 'animateWhenVisible',
    exports: 'named', // avoids default/named export warning
    sourcemap: false,
    plugins: [terser()],
  });
}

export default {
  input: 'src/index.js',
  output: outputs,
};
