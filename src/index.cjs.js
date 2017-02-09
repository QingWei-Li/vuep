import Vuep from './'

if (typeof require !== 'undefined') {
  require('codemirror/addon/mode/overlay')
  require('codemirror/addon/mode/simple')
  require('codemirror/mode/css/css')
  require('codemirror/mode/htmlmixed/htmlmixed')
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')
  require('codemirror/mode/xml/xml')
  require('codemirror/mode/jsx/jsx')
}

export default Vuep
