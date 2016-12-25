export default function (input) {
  const html = document.createElement('div')

  html.innerHTML = input

  try {
    return {
      template: html.querySelector('template').innerHTML,
      script: html.querySelector('script').innerHTML,
      styles: Array.prototype.slice.call(html.querySelectorAll('style')).map(n => n.innerHTML),
      content: html.innerHTML
    }
  } catch (e) {
    return { error: e }
  }
}
