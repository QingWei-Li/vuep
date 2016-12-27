import mock from './mock'
import Vue from 'vue'
import Editor from '../src/components/editor'

const Ctor = Vue.extend(Editor)

describe('editor', () => {
  mock()

  it('init editor', () => {
    const vm = new Ctor().$mount()
    expect(vm.$el.querySelector('.CodeMirror')).toBeDefined()
  })

  it('options', () => {
    const vm = new Ctor({
      propsData: {
        options: {
          theme: 'neo'
        }
      }
    }).$mount()

    expect(vm.currentOptions).toEqual({
      lineNumbers: true,
      mode: 'text/x-vue',
      theme: 'neo',
      tabSize: 2
    })
  })
})
