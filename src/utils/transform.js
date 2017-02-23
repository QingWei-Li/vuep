import require from './require.js'
window.require = require

export default function evalJS (script) {
  // https://www.npmjs.com/package/babel-standalone
  /* istanbul ignore next */

  if (typeof Babel !== 'undefined') {
    const plugins = []

    // Register jsx plugin
    if (window['babel-plugin-transform-vue-jsx']) {
      Babel.registerPlugin('transform-vue-jsx', window['babel-plugin-transform-vue-jsx']) // eslint-disable-line
      plugins.push('transform-vue-jsx')
    }

    script =  Babel.transform(script, { // eslint-disable-line
      presets: [['es2015', { 'loose': true }], 'stage-2'],
      plugins,
      comments: false
    }).code
  }

  script = `(function(exports){var module={};module.exports=exports;${script};return module.exports.__esModule?module.exports.default:module.exports;})({})`
  const result = new Function('return ' + script)() || {} // eslint-disable-line
  return result
}
