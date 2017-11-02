import Vue from 'vue/dist/vue.common'
import assign from '../utils/assign' // eslint-disable-line

export default {
  name: 'preview',

  props: ['value', 'styles', 'keepData'],

  render (h) {
    this.className = 'vuep-scoped-' + this._uid

    return h('div', {
      class: this.className
    }, [
      this.scopedStyle ? h('style', null, this.scopedStyle) : ''
    ])
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
  },

  methods: {
    renderCode (val) {
      const lastData = this.keepData && this.codeVM && assign({}, this.codeVM.$data)

      if (this.codeVM) {
        this.codeVM.$destroy()
        this.$el.removeChild(this.codeVM.$el)
      }

      this.codeEl = document.createElement('div')
      this.$el.appendChild(this.codeEl)

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
