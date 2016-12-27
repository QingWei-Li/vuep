const MODULE_REGEXP = /(export\sdefault|modules.export\s?=)/

export default function ({ template, script = '{}', styles }) {
  // Not exist template or render function
  if (!/template:|render:|render\(/.test(script) && template) {
    script = script.trim().replace(/}$/, `, template: \`${template.trim()}\`}`)
  }

  // fix { , template: '...' } => { template: '...' }
  script = script.replace(/{\s*?,/, '{')

  try {
    if (script === '{}') throw Error('no data')

    // https://www.npmjs.com/package/babel-standalone
    /* istanbul ignore next */
    if (typeof Babel !== 'undefined') {
      script = Babel.transform(script, { // eslint-disable-line
        presets: [['es2015', { 'loose': true, 'modules': false }], 'stage-2']
      }).code
    }

    script = script.replace(MODULE_REGEXP, '').replace(/;$/g, '')

    return {
      result: new Function('return ' + script.trim())(), // eslint-disable-line
      styles: styles && styles.join(' ')
    }
  } catch (e) {
    return { error: e }
  }
}
