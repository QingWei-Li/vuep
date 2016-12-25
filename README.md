# Vuep (vue playground)

> 🎡 A component for rendering Vue components with live editor and preview.




![image](https://cloud.githubusercontent.com/assets/7565692/21471084/f391823e-cade-11e6-9de5-df9455bc50cb.png)

## Try it!
https://qingwei-li.github.io/vuep/

## Installation

### Yarn
```bash
yarn add vuep codemirror
# npm i vuep codemirror -S
```

### HTML tag

```html
<!-- Import theme -->
<link rel="stylesheet" href="//unpkg.com/vuep.css">

<!-- depend vue -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
```

## Quick start

**Need the full (compiler-included) CommonJS build of Vue**
webpack config
```javascript
{
  alias: {
    'vue$': 'vue/dist/vue.common'
  }
}
```

```javascript
import Vue from 'vue'
import Vuep from 'vuep'

Vue.use(Vuep {, /* codemirror options */ })
// or Vue.component('Vuep', Vuep)

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
  <vuep :template="code"></vuep>
</div>
```

### Usage B
you can written in HTML file or even the Markdown file.

```html
<div id="app">
  <vuep template="#example"></vuep>
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


## Roadmap

- More usages
- Unit test
- Supports style tag


## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :D


## Development

```shell
npm i && npm run dev
open test/test.html
```

## LICENSE
MIT

