import evalJS from './transform.js'

const JSMODULE_REG = /\.((js)|(jsx))$/

export default function require (url) {
  if (JSMODULE_REG.test(url)) {
    return getAndCache(url)
  }
}

// modify from docsify: https://github.com/QingWei-Li/docsify/blob/master/src/core/fetch/ajax.js

const cache = {}

/**
 * Simple ajax get
 * @param {string} url
 * @return { then(resolve, reject), abort }
 */
function getAndCache (url) {
  const xhr = new XMLHttpRequest() // eslint-disable-line

  if (cache[url]) {
    return cache[url]
  }

  xhr.open('GET', url, false)
  xhr.send()
  const script = xhr.responseText
  cache[url] = evalJS(script)
  return cache[url]
}
