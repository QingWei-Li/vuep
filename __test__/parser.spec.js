import parser from '../src/utils/parser'

test('script tag', () => {
  const fixture = `
    <style> div { color: red } </style>
    <template>
      <div>123</div>
    </template>
    <script>
      module.exports = {}
    </script>
  `
  const result = parser(fixture)

  expect(result.template).toContain('<div>123</div>')
  expect(result.script).toContain('module.exports = {}')
  expect(Array.isArray(result.styles)).toBeTruthy()
  expect(result.styles.length).toEqual(1)
  expect(result.styles[0]).toContain('div { color: red }')
})

test('multiple style', () => {
  const fixture = `
    <style> div { color: red } </style>
    <style> div { color: green } </style>
    <style> div { color: blue } </style>
  `
  const result = parser(fixture)

  expect(Array.isArray(result.styles)).toBeTruthy()
  expect(result.styles.length).toEqual(3)
  expect(result.styles[0]).toContain('div { color: red }')
  expect(result.styles[1]).toContain('div { color: green }')
  expect(result.styles[2]).toContain('div { color: blue }')
})

test('only JavaScript', () => {
  const fixture = 'module.exports = {}'
  const result = parser(fixture)

  expect(result.template).toBeUndefined()
  expect(result.script).toContain('module.exports = {}')
  expect(result.styles).toBeUndefined()
})
