import Editor from './editor'
import Preview from './preview'
import parser from '../utils/parser'
import compiler from '../utils/compiler'

export default {
  name: 'Vuep',

  props: {
    template: String,
    options: {},
    keepData: Boolean,
    value: String,
    scope: Object,
    iframe: Boolean,
    fitIframe: Boolean,
    iframeClass: {
      type: String,
      default: 'vuep-iframe-preview'
    }
  },

  data () {
    return {
      content: '',
      preview: '',
      styles: '',
      error: ''
    }
  },

  render (h) {
    let win

    /* istanbul ignore next */
    if (this.error) {
      win = h('div', {
        class: 'vuep-error'
      }, [this.error])
    } else {
      win = h(Preview, {
        class: 'vuep-preview',
        props: {
          value: this.preview,
          styles: this.styles,
          keepData: this.keepData,
          iframe: this.iframe,
          fitIframe: this.fitIframe,
          iframeClass: this.iframeClass
        },
        on: {
          error: this.handleError
        }
      })
    }

    const editor = h(Editor, {
      class: 'vuep-editor',
      props: {
        value: this.content,
        options: this.options
      },
      on: {
        change: [this.executeCode, val => this.$emit('input', val)]
      }
    })

    let children = [editor, win]
    if (this.$slots.default) {
      children = this.addSlots(h, this.$slots.default, [
        {
          name: 'vuep-preview',
          child: win
        },
        {
          name: 'vuep-editor',
          child: editor
        }
      ])
    }
    return h('div', { class: 'vuep' }, children)
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        val && this.executeCode(val)
      }
    }
  },

  created () {
      /* istanbul ignore next */
    if (this.$isServer) return
    let content = this.template

    if (/^[\.#]/.test(this.template)) {
      const html = document.querySelector(this.template)
      if (!html) throw Error(`${this.template} is not found`)

      /* istanbul ignore next */
      content = html.innerHTML
    }

    if (content) {
      this.executeCode(content)
      this.$emit('input', content)
    }
  },

  methods: {
    addSlots (h, vnodes, slots) {
      return vnodes.map(vnode => {
        let children = []
        slots.forEach(({ name, child }) => {
          if (vnode.data && vnode.data.attrs && vnode.data.attrs[name] !== undefined) {
            children = [child]
          }
        })
        if (!children.length && vnode.children && vnode.children.length) {
          children = this.addSlots(h, vnode.children, slots)
        }
        return h(vnode.tag, vnode.data, children)
      })
    },

    handleError (err) {
      /* istanbul ignore next */
      this.error = err
    },

    executeCode (code) {
      this.error = ''
      const result = parser(code)

      /* istanbul ignore next */
      if (result.error) {
        this.error = result.error.message
        return
      }

      const compiledCode = compiler(result, this.scope)

      /* istanbul ignore next */
      if (compiledCode.error) {
        this.error = compiledCode.error.message
        return
      }

      this.content = result.content
      this.preview = compiledCode.result
      if (compiledCode.styles) this.styles = compiledCode.styles
    }
  }
}
