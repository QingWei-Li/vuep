import mock from './mock'
import Vue from 'vue'
import Playground from '../src/components/playground'

const Ctor = Vue.extend(Playground)

describe('playground', () => {
  mock()

  it('element is not found', () => {
    expect(() => new Ctor({
      propsData: {
        template: '#app'
      }
    }).$mount()).toThrowError('#app is not found')
  })

  it('work', () => {
    const vm = new Ctor({
      propsData: {
        template: `module.exports = { template: '<div>123</div>' }`
      }
    }).$mount()

    vm.$nextTick(_ => {
      expect(vm.preview).toEqual({
        template: '<div>123</div>'
      })
      expect(vm.content).toEqual(`module.exports = { template: '<div>123</div>' }`)
    })
  })

  it('styles', () => {
    const vm = new Ctor({
      propsData: {
        template: `<style>.main {}</style><script>module.exports = {}</script>`
      }
    }).$mount()

    vm.$nextTick(_ => {
      expect(vm.preview).toEqual({})
      expect(vm.styles).toEqual('.main {}')
    })
  })
})
