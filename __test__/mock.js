export default function () {
  // mock createTextRange function
  // https://discuss.codemirror.net/t/working-in-jsdom-or-node-js-natively/138/2
  document.body.createTextRange = function () {
    return {
      setEnd: () => {},
      setStart: () => {},
      getBoundingClientRect: () => ({ right: 0 }),
      getClientRects: () => ({ right: 0 })
    }
  }
}
