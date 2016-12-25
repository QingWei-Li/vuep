import Vue from 'vue'

export default {
  name: 'preview',

  props: ['value'],

  render (h) {
    return h('div', { class: 'preview' })
  },

  mounted () {
    this.$watch('value', this.renderCode, { immediate: true })
  },

  methods: {
    renderCode (val) {
      if (this.codeVM) {
        this.codeVM.$destroy()
        this.codeVM.$el.parentNode && this.$el.removeChild(this.codeVM.$el)
      }

      this.codeEl = document.createElement('div')
      this.$el.appendChild(this.codeEl)
      this.codeVM = new Vue(val).$mount(this.codeEl)
    }
  }
}
