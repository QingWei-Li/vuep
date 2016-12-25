const MODULE_REGEXP = /(export\sdefault|modules.export)/

export default function ({ template, script, styles }) {
  // TODO: styles

  script = script.trim()

  // Not exist template or render function
  if (!/template:|render:|render\(/.test(script) && template) {
    script = script.replace(/}.*?$/, `, template: \`${template.trim()}\`}`)
  }

  try {
    // https://www.npmjs.com/package/babel-standalone
    if (typeof Babel !== 'undefined') {
      script = Babel.transform(script, { // eslint-disable-line
        presets: [['es2015', { 'loose': true, 'modules': false }], 'stage-2']
      }).code
    }

    script = script.replace(MODULE_REGEXP, '').replace(/;$/g, '')

    return { result: new Function('return ' + script)() }// eslint-disable-line
  } catch (e) {
    return { error: e }
  }
}
