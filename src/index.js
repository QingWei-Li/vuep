import Playground from './components/playground'

function install (Vue) {
  Vue.component(Playground.name, Playground)
}

Playground.install = install

if (typeof Vue !== 'undefined') {
  Vue.use(install) // eslint-disable-line
}

export default Playground
