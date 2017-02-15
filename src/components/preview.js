import Vue from 'vue/dist/vue.common'
import assign from '../utils/assign' // eslint-disable-line

export default {
  name: 'preview',

  props: ['value', 'styles'],

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
        ? this.styles.replace(/([\.#\w]+\w*?\s?{)/g, `.${this.className} $1`)
        : ''
    }
  },

  mounted () {
    this.$watch('value', this.renderCode, { immediate: true })
  },

  methods: {
    renderCode (val) {
      if (this.codeVM) {
        this.codeVM.$destroy()
        this.$el.removeChild(this.codeVM.$el)
      }

      this.codeEl = document.createElement('div')
      this.$el.appendChild(this.codeEl)

      try {
        const parent = this
        this.codeVM = new Vue({ parent, ...val }).$mount(this.codeEl)
      } catch (e) {
        /* istanbul ignore next */
        this.$emit('error', e)
      }
    }
  }
}
