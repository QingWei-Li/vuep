import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [buble(), commonjs(), nodeResolve()],
  dest: 'dist/vue-playground.js',
  format: 'umd',
  moduleName: 'VuePlayground',
  external: ['codemirror', 'vue'],
  globals: {
    codemirror: 'CodeMirror',
    vue: 'Vue'
  }
}
