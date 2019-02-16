import Vue from 'vue'
import Preview from '../src/components/preview'
import css from 'css'

const Ctor = Vue.extend(Preview)

test('scoped style', () => {
  const vm = new Ctor({
    propsData: {
      styles: '.main { color: red } #id { width: 10px } p { height: 20 } .wrapper input { background: url("");} @keyframes load { 0%, 100% {height: 40px;} 50% {height: 70px;} }'
    }
  }).$mount()
  const _uid = vm._uid
  const scoped = '.vuep-scoped-' + _uid
  const fixture = `${scoped} .main { color: red } ${scoped} #id { width: 10px } ${scoped} p { height: 20 } ${scoped} .wrapper input { background: url("");} @keyframes load { 0%, 100% {height: 40px;} 50% {height: 70px;} }
`

  expect(vm.scopedStyle).toEqual(css.stringify(css.parse(fixture), { compress: true }))
})

describe('append new vm', () => {
  const vm = new Ctor({
    propsData: {
      value: {
        template: '<div>hello, {{ name }}</div>',
        data: {
          name: 'cinwell'
        }
      }
    }
  }).$mount()

  it('created', () => {
    expect(vm.codeVM).toBeDefined()
    expect(vm.codeVM.$el.textContent).toEqual('hello, cinwell')
  })

  it('updated', () => {
    vm.value = {
      template: '<div>{{ name }}</div>',
      data: {
        name: 'cinwell'
      }
    }

    vm.$nextTick(_ => {
      expect(vm.codeVM.$el.textContent).toEqual('cinwell')
    })
  })
})
