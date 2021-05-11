export default class IframeStyler {
  constructor ($el) {
    this.$el = $el
    this.observer = null
    this.style = this.styleIframe.bind(this)
    this.styleEl = null
    this.styleNodes = []
    this.styles = null
  }

  start () {
    this.observe()
    this.style()
  }

  stop () {
    this.stopObserve()
  }

  setStyles (styles) {
    this.styles = styles
    this.style()
  }

  observe () {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    if (MutationObserver) {
      const head = document.querySelector('head')
      const config = { attributes: true, childList: true, subtree: true }
      this.observer = new MutationObserver(this.style)
      this.observer.observe(head, config)
    }
  }

  stopObserve () {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  styleIframe () {
    if (!this.$el || !this.$el.contentDocument) {
      return
    }
    const head = this.$el.contentDocument.head
    // Remove old styles
    if (this.styleEl) {
      head.removeChild(this.styleEl)
    }
    for (const key in this.styleNodes) {
      head.removeChild(this.styleNodes[key])
    }
    // Set new styles
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
}

function getDocumentStyle () {
  const links = document.querySelectorAll('link[rel="stylesheet"]')
  const styles = document.querySelectorAll('style')
  return Array.from(links).concat(Array.from(styles))
}
