import compiler from '../src/utils/compiler'

test('No data', () => {
  const compiled = compiler({})

  expect(compiled.error.name).toEqual('Error')
  expect(compiled.error.message).toEqual('no data')
})

test('only template', () => {
  const compiled = compiler({
    template: '<div></div>'
  })

  expect(compiled.result).toEqual({
    template: '<div></div>'
  })
})

test('only empty script', () => {
  const compiled = compiler({
    script: 'module.exports = {}'
  })

  expect(compiled.result).toEqual({})
})

test('only script', () => {
  const compiled = compiler({
    script: `module.exports = {template : '<div></div>'}`
  })

  expect(compiled.result).toEqual({
    template: '<div></div>'
  })
})

test('script and tempalte', () => {
  const compiled = compiler({
    template: '<div><h1>cinwell</h1></div>',
    script: 'module.exports = { b: {} }'
  })

  expect(compiled.result).toEqual({
    b: {},
    template: '<div><h1>cinwell</h1></div>'
  })
})

test('multiple style tag', () => {
  const compiled = compiler({
    styles: [
      '.a { color: #ccc }',
      '.b { height: 100px; width: 200px }'
    ],
    template: '<div></div>'
  })

  expect(compiled.styles).toEqual('.a { color: #ccc } .b { height: 100px; width: 200px }')
})

test('no style', () => {
  const compiled = compiler({
    template: '<div></div>'
  })

  expect(compiled.styles).toBeUndefined()
})
