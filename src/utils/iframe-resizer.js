export default class IframeResizer {
  constructor ($el) {
    this.$el = $el
    this.observer = null
    this.resize = this.resizeIframe.bind(this)
  }

  start () {
    this.resize()
  }

  stop () {
    this.stopObserve()
  }

  observe () {
    this.bindResizeObserver()
    this.bindContentObserver()
  }

  stopObserve () {
    this.unbindResizeObserver()
    this.unbindContentObserver()
  }

  resizeIframe () {
    if (!this.$el || !this.$el.contentWindow) {
      return
    }
    this.stopObserve()
    const body = this.$el.contentWindow.document.body
    // Add element for height calculation
    const heightEl = document.createElement('div')
    body.appendChild(heightEl)
    const padding = getPadding(this.$el)
    const bodyOffset = getPadding(body) + getMargin(body)
    this.$el.style.height = `${heightEl.offsetTop + padding + bodyOffset}px`
    body.removeChild(heightEl)
    setTimeout(this.observe.bind(this), 100)
  }

  bindResizeObserver () {
    if (this.$el && this.$el.contentWindow) {
      this.$el.contentWindow.addEventListener(
        'resize',
        this.resize
      )
    }
  }

  unbindResizeObserver () {
    if (this.$el && this.$el.contentWindow) {
      this.$el.contentWindow.removeEventListener(
        'resize',
        this.resize
      )
    }
  }

  bindContentObserver () {
    if (!this.$el || !this.$el.contentWindow) {
      return
    }
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
      this.observer = new MutationObserver(this.resize)
      this.observer.observe(target, config)
    }
  }

  unbindContentObserver () {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
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
