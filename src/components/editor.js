import CodeMirror from 'codemirror'

export default {
  name: 'VueCodeMirror',

  props: ['value'],

  render (h) {
    return h('textarea', null, this.value)
  },

  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$el, {
    })

    this.editor.on('change', this.handleChange)
  },

  methods: {
    handleChange () {
      this.$emit('change', this.editor.getValue())
    }
  }
}
