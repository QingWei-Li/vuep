import Vue from 'vue/dist/vue.common'
import assign from '../utils/assign' // eslint-disable-line
import IframeResizer from '../utils/iframe-resizer'
import IframeStyler from '../utils/Iframe-styler'

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
      resizer: null,
      styler: null
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
      this.styler = new IframeStyler(this.$el)
      this.renderCode()
      this.startStyler()
    },
    cleanupIframe () {
      this.stopResizer()
      this.stopStyler()
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
    startStyler () {
      if (this.styler) {
        this.styler.start()
        this.styler.setStyles(this.styles)
      }
    },
    stopStyler () {
      if (this.styler) {
        this.styler.stop()
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
        if (this.styler) {
          this.styler.setStyles(this.styles)
        }
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
