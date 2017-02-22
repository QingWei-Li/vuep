const JSMODULE_REG = /\.((js)|(jsx))$/
export default function (url, callback) {
  if (JSMODULE_REG.test(url)) {
    let script = get(url)
    if (typeof Babel !== 'undefined') {
      const plugins = []

      // Register jsx plugin
      if (window['babel-plugin-transform-vue-jsx']) {
        Babel.registerPlugin('transform-vue-jsx', window['babel-plugin-transform-vue-jsx']) // eslint-disable-line
        plugins.push('transform-vue-jsx')
      }

      script = Babel.transform(script, { // eslint-disable-line
        presets: [['es2015', { 'loose': true }], 'stage-2'],
        plugins,
        comments: false
      }).code
      console.log(script)
    }
    script = `(function(exports){var module={};module.exports=exports;${script};return module.exports.__esModule?module.exports.default:module.exports;})({})`
    return new Function('return ' + script)()
  }
}

// from docsify: https://github.com/QingWei-Li/docsify/blob/master/src/core/fetch/ajax.js

const cache = {}

/**
 * Simple ajax get
 * @param {string} url
 * @return { then(resolve, reject), abort }
 */
function get (url) {
  const xhr = new window.XMLHttpRequest()

  if (cache[url]) {
    return cache[url]
  }

  xhr.open('GET', url, false)
  xhr.send()
  return xhr.responseText
}
