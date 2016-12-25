import CodeMirror from 'codemirror'
if (typeof require !== 'undefined') {
  require('codemirror/addon/mode/overlay')
  require('codemirror/addon/mode/simple')
  require('codemirror/mode/css/css')
  require('codemirror/mode/htmlmixed/htmlmixed')
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')
  require('codemirror/mode/xml/xml')
}

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
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, Object.assign(DEFAULT_OPTIONS, this.options))
    this.editor.on('change', this.handleChange)
  },

  methods: {
    handleChange () {
      this.$emit('change', this.editor.getValue())
    }
  }
}
