import Vue from 'vue/dist/vue.common'
import assign from '../utils/assign' // eslint-disable-line

export default {
  name: 'preview',

  props: ['value', 'styles', 'keepData', 'iframe', 'fitIframe'],

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
      iframeObserver: null
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
    }
  },
  beforeDestroy () {
    if (this.iframe) {
      this.$el.removeEventListener('load', this.initIframe)
      this.cleanupIframe()
    }
  },
  methods: {
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
    },
    initIframe () {
      this.bindIframeResizeObserver()
      this.bindIframeContentObserver()
      this.renderCode()
    },
    cleanupIframe () {
      this.unbindIframeResizeObserver()
      this.unbindIframeContentObserver()
    },
    bindIframeResizeObserver () {
      this.$el.contentWindow.addEventListener(
        'resize',
        this.resizeIframe
      )
    },
    unbindIframeResizeObserver () {
      if (this.$el && this.$el.contentWindow) {
        this.$el.contentWindow.removeEventListener(
          'resize',
          this.resizeIframe
        )
      }
    },
    bindIframeContentObserver () {
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
      if (MutationObserver) {
        const target = this.$el.contentWindow.document.body
        const config = {
          attributes: true,
          attributeOldValue: false,
          characterData: true,
          characterDataOldValue: false,
          childList: true,
          subtree: true
        }
        this.iframeObserver = new MutationObserver(this.resizeIframe)
        this.iframeObserver.observe(target, config)
      }
    },
    unbindIframeContentObserver () {
      this.iframeObserver.disconnect()
    },
    resizeIframe () {
      if (!this.fitIframe || !this.$el || !this.$el.contentWindow) {
        return
      }
      this.unbindIframeResizeObserver()
      const body = this.$el.contentWindow.document.body
      if (body.children && body.children[0]) {
        const padding = getPadding(this.$el)
        const child = body.children[0]
        const childHeight = child.offsetHeight
        const bodyOffset = getPadding(body) + getMargin(body)
        this.$el.style.height = `${childHeight + padding + bodyOffset}px`
      }
      setTimeout(this.bindIframeResizeObserver, 100)
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

function getPadding (e) {
  return getProperty(e, 'padding-top') + getProperty(e, 'padding-bottom')
}

function getMargin (e) {
  return getProperty(e, 'margin-top') + getProperty(e, 'margin-bottom')
}

function getProperty (e, p) {
  return parseInt(window.getComputedStyle(e, null).getPropertyValue(p))
}
