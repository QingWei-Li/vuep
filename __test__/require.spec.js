import require from '../src/utils/require.js'

let count = 0
beforeAll(() => {
  global.XMLHttpRequest = () => {
    return {
      open (url) {
        count++
      },
      send () {
      },
      responseText: 'module.exports="from remote"'
    }
  }
})

test('require works', () => {
  global.XMLHttpRequest = () => {
    return {
      open (url) {
        count++
      },
      send () {
      },
      responseText: 'module.exports="from remote"'
    }
  }
  expect(require('test.js')).toEqual('from remote')
})

test('require cache works', () => {
  require('test.js')
  require('test.js')
  require('test.js')
  require('test.js')
  expect(count).toEqual(1)
})
