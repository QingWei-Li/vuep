import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [buble(), commonjs(), nodeResolve()],
  dest: 'dist/vuep.js',
  format: 'umd',
  moduleName: 'Vuep',
  external: ['codemirror', 'vue/dist/vue.common'],
  globals: {
    codemirror: 'CodeMirror',
    'vue/dist/vue.common': 'Vue'
  }
}
