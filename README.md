# vue-playground

> A component for rendering Vue components with live editor and preview.

## Installation

```bash
yarn add vue-playground
# npm i vue-playground -S
```

## Quick start

```javascript
import Vue from 'vue'
import VuePlayground from 'vue-playground'

Vue.use(Playground)
// or Vue.component('VuePlayground', Playground)

new Vue({
  el: '#app',

  created: function () {
    this.code = `
      <template>
        <div>Hello, {{ name }}!</div>
      </template>

      <script>
        export default {
          data: function () {
            return { name: 'Vue' }
          }
        }
      </script>
    `
  }
})
```


### Usage A
```html
<div id="app">
  <vue-playground :template="code"></vue-playground>
</div>
```

### Usage B
you can written in HTML file or even the Markdown file.

```html
<div id="app">
  <vue-playground template="#example"></vue-playground>
</div>

<script type="text/x-template" id="example">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    export default {
      data: function () {
        return { name: 'Vue' }
      }
    }
  </script>
</script>
```

## Inspired
- https://facebook.github.io/react/
- https://github.com/FormidableLabs/component-playground

## LICENSE
MIT
