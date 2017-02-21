# Vuep (vue playground)

[![Build Status](https://travis-ci.org/QingWei-Li/vuep.svg?branch=master)](https://travis-ci.org/QingWei-Li/vuep)
[![Coverage Status](https://coveralls.io/repos/github/QingWei-Li/vuep/badge.svg?branch=master)](https://coveralls.io/github/QingWei-Li/vuep?branch=master)
[![npm](https://img.shields.io/npm/v/vuep.svg)](https://www.npmjs.com/package/vuep)


> 🎡 A component for rendering Vue components with live editor and preview.

![image](https://cloud.githubusercontent.com/assets/7565692/21482443/093e4970-cbaf-11e6-89f0-eae73fc49741.png)

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
<link rel="stylesheet" href="//unpkg.com/vuep/dist/vuep.css">

<!-- depend vue -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
```

## Quick start

**Need the full (compiler-included) build of Vue**

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
import 'vuep/dist/vuep.css'

Vue.use(Vuep /*, { codemirror options } */)
// or Vue.component('Vuep', Vuep)

new Vue({
  el: '#app',

  created: function () {
    this.code = `
      <template>
        <div>Hello, {{ name }}!</div>
      </template>

      <script>
        module.exports = {
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
you can written in HTML file or even a markdown file.

```html
<div id="app">
  <vuep template="#example"></vuep>
</div>

<script type="text/x-template" id="example">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    module.exports = {
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


## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :D


## Development

```shell
yarn && yarn dev
# npm i && npm run dev
open test.html
```

## LICENSE
MIT
