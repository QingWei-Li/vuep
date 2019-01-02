# Vuep (vue playground)

[![Build Status](https://travis-ci.org/QingWei-Li/vuep.svg?branch=master)](https://travis-ci.org/QingWei-Li/vuep)
[![Coverage Status](https://coveralls.io/repos/github/QingWei-Li/vuep/badge.svg?branch=master)](https://coveralls.io/github/QingWei-Li/vuep?branch=master)
[![npm](https://img.shields.io/npm/v/vuep.svg)](https://www.npmjs.com/package/vuep)


> 🎡 A component for rendering Vue components with live editor and preview.



![image](https://cloud.githubusercontent.com/assets/7565692/21482443/093e4970-cbaf-11e6-89f0-eae73fc49741.png)

## Links

- Docs: https://cinwell.com/vuep/
- An online playgound: https://vuep.netlify.com



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
you can write in HTML file or even a markdown file.

```html
<div id="app">
  <vuep template="#example"></vuep>
</div>

<script v-pre type="text/x-template" id="example">
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

### Scope

You can customize scope by passing an object to the scope property. 

This object can contain component available in main scope to include them into Vuep.

- **features.js**: Component to showcase into Vuep
```javascript
export default {
  props: {
    features: Array
  },
  template: `<div class="features">
<h3>Features</h3>
<ul>
  <li v-for="feature in features">{{ feature }}</li>
</ul>
</div>`
}
```

- **app.js**: Application that needs to showcase Features component through Vuep
```javascript
import Vue from 'vue'

import Features from 'features' // Import component

new Vue({
  el: '#app',
  data: function () {
    return {
      scope: { Features }, // Set the scope of vuep
      value: `
<template>
  <div>
    <features :features="features"></features>
  </div>
</template>

<script>
  export default {
    components: {
      Features // This variable is available through scope and can be used to register component
    },
    data () {
      return {
        features: [
          'Vue Single File Component support',
          'Scoped style',
          'UMD and CommonJS build',
          'Define JavaScript scope'
        ]
      }
    }
  }<\/script>`
      }
    }
  })
```

- **app template**: 
```html
<div id="app">
  <vuep :value="value" :scope="scope"></vuep>
</div>
```

### Custom layout

You can provide a custom layout for vuep to render the editor and preview in.
Add a div with the attribute `vuep-preview` and one with `vuep-editor` so vuep knows where to render these components.

```html
<div id="app">
  <vuep :value="value">
    <div class="custom-layout">
      <h2>My custom preview</h2>
      <div class="custom-preview" vuep-preview></div>
      <h2>My custom editor</h2>
      <div class="custom-editor" vuep-editor></div>
    </div>
  </vuep>
</div>
```

### Code example iframe

Vuep can render the code example inside an iframe. This is useful for testing components with elements set to `position: fixed`.

```html
<div id="app">
  <vuep :value="value" iframe></vuep>
</div>
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
