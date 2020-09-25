export default function (input) {
  const html = document.createElement('div')
  const content = html.innerHTML = input.trim()

  try {
    const template = html.querySelector('template')
    const script = html.querySelector('script')
    const styles = Array.prototype.slice.call(html.querySelectorAll('style')).map(n => n.innerHTML)

    if (!template && !script && !styles.length) {
      return {
        content,
        script: content
      }
    }

    return {
      content: content,
      template: template ? template.innerHTML : '',
      script: script ? script.innerHTML : '',
      styles: styles
    }
  } catch (error) {
    /* istanbul ignore next */
    return { error }
  }
}
