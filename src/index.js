import Vuep from './components/playground'

Vuep.config = function (opts) {
  Vuep.props.options.default = () => opts
}

function install (Vue, opts) {
  Vuep.config(opts)
  Vue.component(Vuep.name, Vuep)
}

Vuep.install = install

if (typeof Vue !== 'undefined') {
  Vue.use(install) // eslint-disable-line
}

export default Vuep
