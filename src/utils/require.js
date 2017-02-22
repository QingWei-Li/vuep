import evalJS from './transform.js'

const JSMODULE_REG = /\.((js)|(jsx))$/

export default function require (url) {
  if (JSMODULE_REG.test(url)) {
    const script = get(url)
    return evalJS(script)
  }
}

window.require = require

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
