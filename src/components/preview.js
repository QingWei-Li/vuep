import Vue from 'vue/dist/vue.common'

export default {
  name: 'preview',

  props: ['value', 'styles'],

  render (h) {
    this.className = 'vuep-scoped-' + this._uid

    return h('div', {
      class: this.className
    })
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
        this.codeVM = new Vue(val).$mount(this.codeEl)

        if (this.styles) {
          const style = document.createElement('style')

          style.innerHTML = this.styles.replace(/([\.#\w]+\w+\s?{)/g, `.${this.className} $1`)
          this.codeVM.$el.appendChild(style)
        }
      } catch (e) {
        this.$emit('error', e)
      }
    }
  }
}
