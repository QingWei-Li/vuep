import Vue from 'vue/dist/vue.common'
import assign from '../utils/assign' // eslint-disable-line
import IframeResizer from '../utils/iframeResizer'

export default {
  name: 'preview',

  props: ['value', 'styles', 'keepData', 'iframe', 'fitIframe', 'iframeClass'],

  render (h) {
    this.className = 'vuep-scoped-' + this._uid

    return h(this.iframe ? 'iframe' : 'div', {
      class: this.className
    }, [
      this.scopedStyle ? h('style', null, this.scopedStyle) : ''
    ])
  },

  data () {
    return {
      resizer: null
    }
  },

  computed: {
    scopedStyle () {
      return this.styles
        ? insertScope(this.styles, `.${this.className}`)
        : ''
    }
  },

  mounted () {
    this.$watch('value', this.renderCode, { immediate: true })
    if (this.iframe) {
      // Firefox needs the iframe to be loaded
      if (this.$el.contentDocument.readyState === 'complete') {
        this.initIframe()
      } else {
        this.$el.addEventListener('load', this.initIframe)
      }
      this.$watch('fitIframe', (fitIframe) => {
        fitIframe ? this.startResizer() : this.stopResizer()
      }, { immediate: true })
    }
  },
  beforeDestroy () {
    if (this.iframe) {
      this.$el.removeEventListener('load', this.initIframe)
      this.cleanupIframe()
    }
  },
  methods: {
    initIframe () {
      this.resizer = new IframeResizer(this.$el)
      this.renderCode()
    },
    cleanupIframe () {
      this.stopResizer()
    },
    startResizer () {
      if (this.resizer) {
        this.resizer.start()
      }
    },
    stopResizer () {
      if (this.resizer) {
        this.resizer.stop()
      }
    },
    renderCode () {
      // Firefox needs the iframe to be loaded
      if (this.iframe && this.$el.contentDocument.readyState !== 'complete') {
        return
      }

      const val = this.value
      const lastData = this.keepData && this.codeVM && assign({}, this.codeVM.$data)
      const container = this.iframe ? this.$el.contentDocument.body : this.$el

      if (this.codeVM) {
        this.codeVM.$destroy()
        container.removeChild(this.codeVM.$el)
      }

      this.codeEl = document.createElement('div')
      container.appendChild(this.codeEl)

      if (this.iframe) {
        container.classList.add(this.iframeClass)
        const head = this.$el.contentDocument.head
        if (this.styleEl) {
          head.removeChild(this.styleEl)
          for (const key in this.styleNodes) {
            head.removeChild(this.styleNodes[key])
          }
        }
        this.styleEl = document.createElement('style')
        this.styleEl.appendChild(document.createTextNode(this.styles))
        this.styleNodes = []
        const documentStyles = getDocumentStyle()
        for (const key in documentStyles) {
          this.styleNodes[key] = documentStyles[key].cloneNode(true)
          head.appendChild(this.styleNodes[key])
        }
        head.appendChild(this.styleEl)
      }

      try {
        const parent = this
        this.codeVM = new Vue({ parent, ...val }).$mount(this.codeEl)

        if (lastData) {
          for (const key in lastData) {
            this.codeVM[key] = lastData[key]
          }
        }
      } catch (e) {
        /* istanbul ignore next */
        this.$emit('error', e)
      }
    }
  }
}

function insertScope (style, scope) {
  const regex = /(^|\})\s*([^{]+)/g
  return style.trim().replace(regex, (m, g1, g2) => {
    return g1 ? `${g1} ${scope} ${g2}` : `${scope} ${g2}`
  })
}

function getDocumentStyle () {
  const links = document.querySelectorAll('link[rel="stylesheet"]')
  const styles = document.querySelectorAll('style')
  return Array.from(links).concat(Array.from(styles))
}
