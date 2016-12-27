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
    })).toThrowError('#app is not found')
  })

  it('work', () => {
    const vm = new Ctor({
      propsData: {
        template: `export default { template: '<div>123</div>' }`
      }
    }).$mount()

    vm.$nextTick(_ => {
      expect(vm.preview).toEqual({
        template: '<div>123</div>'
      })
      expect(vm.content).toEqual(`export default { template: '<div>123</div>' }`)
    })
  })

  it('styles', () => {
    const vm = new Ctor({
      propsData: {
        template: `<style>.main {}</style><script>export default {}</script>`
      }
    }).$mount()

    vm.$nextTick(_ => {
      expect(vm.preview).toEqual({})
      expect(vm.styles).toEqual('.main {}')
    })
  })
})
