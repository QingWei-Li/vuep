import Editor from './editor'
import Preview from './preview'
import parser from '../utils/parser'
import compiler from '../utils/compiler'

export default {
  name: 'VuePlayground',

  props: {
    template: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      content: '',
      preview: '',
      error: ''
    }
  },

  render (h) {
    return h('div', {}, [
      h(Editor, {
        props: {
          value: this.content
        },
        on: {
          change: this.executeCode
        }
      }),
      h(Preview, {
        props: {
          value: this.preview
        }
      }),
      h('div', null, [this.error])
    ])
  },

  created () {
    let content = this.template

    if (/^[\.#]/.test(this.template)) {
      if (this.$isServer) return
      const html = document.querySelector(this.template)
      if (!html) throw Error(`${this.template} is not found`)

      content = html.innerHTML
    }

    this.executeCode(content)
  },

  methods: {
    executeCode (code) {
      this.error = ''
      const result = parser(code)

      if (result.error) {
        this.error = result.error.toString()
        return
      }

      const compiledCode = compiler(result)

      if (compiledCode.error) {
        this.error = compiledCode.error.toString()
        return
      }

      this.content = result.content
      this.preview = compiledCode.result
    }
  }
}
