export default function (input) {
  const html = document.createElement('div')

  html.innerHTML = input

  const content = html.innerHTML

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
      content,
      template: template ? template.innerHTML : '',
      script: script ? script.innerHTML : '',
      styles: styles
    }
  } catch (e) {
    return { error: e }
  }
}
