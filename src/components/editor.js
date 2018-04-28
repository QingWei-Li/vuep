import assign from '../utils/assign'

const DEFAULT_OPTIONS = {
  lineNumbers: true,
  mode: 'text/x-vue',
  theme: 'material',
  tabSize: 2
}

export default {
  name: 'VueCodeMirror',

  props: ['value', 'options'],

  render (h) {
    return h('div', null, [
      h('textarea', { ref: 'textarea' }, this.value)
    ])
  },

  mounted () {
    this.currentOptions = assign({}, DEFAULT_OPTIONS, this.options)
    const codemirror = require('codemirror')
    require('codemirror/addon/mode/overlay')
    require('codemirror/addon/mode/simple')
    require('codemirror/mode/css/css')
    require('codemirror/mode/htmlmixed/htmlmixed')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/vue/vue')
    require('codemirror/mode/xml/xml')
    require('codemirror/mode/jsx/jsx')
    this.editor = codemirror.fromTextArea(this.$refs.textarea, this.currentOptions)
    this.editor.on('change', this.handleChange)
  },

  watch: {
    value (val) {
      val !== this.editor.getValue() && this.editor.setValue(val)
    }
  },

  methods: {
    handleChange () {
      /* istanbul ignore next */
      this.$emit('change', this.editor.getValue())
    }
  }
}
