import Editor from './editor'
import Preview from './preview'
import parser from '../utils/parser'
import compiler from '../utils/compiler'

export default {
  name: 'Vuep',

  props: {
    template: {
      type: String,
      required: true
    },
    options: {}
  },

  data () {
    return {
      content: '',
      preview: '',
      error: ''
    }
  },

  render (h) {
    let win

    if (this.error) {
      win = h('div', {
        class: 'vuep-error'
      }, [this.error])
    } else {
      win = h(Preview, {
        class: 'vuep-preview',
        props: {
          value: this.preview
        },
        on: {
          error: this.handleError
        }
      })
    }

    return h('div', { class: 'vuep' }, [
      h(Editor, {
        class: 'vuep-editor',
        props: {
          value: this.content,
          options: this.options
        },
        on: {
          change: this.executeCode
        }
      }),
      win
    ])
  },

  created () {
    if (this.$isServer) return
    let content = this.template

    if (/^[\.#]/.test(this.template)) {
      const html = document.querySelector(this.template)
      if (!html) throw Error(`${this.template} is not found`)

      content = html.innerHTML
    }

    this.executeCode(content)
  },

  methods: {
    handleError (err) {
      this.error = err
    },

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
