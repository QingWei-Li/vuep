# Demo
<vuep template="#demo1"></vuep>

<script type="text/x-template" id="demo1">
<template>
  <div>Hello, {{ name }}!</div>
</template>

<script>
  export default {
    data() {
      return { name: 'Vue' }
    }
  }
</script>
</script>


<br>
# Usage

## CommonJS
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

template
```html
<div id="app">
  <vuep :template="code"></vuep>
</div>
```

## UMD

index.html
```html
<!-- Import theme -->
<link rel="stylesheet" href="//unpkg.com/vuep.css">

<!-- depend vue -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
```

template
```html
<vuep template="#example"></vuep>

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

# Options

https://codemirror.net/index.html

```javascript
Vue.use(Vuep, { /* codemirror config */ })
```

Default config
```json
{
  "lineNumbers": true,
  "mode": "text/x-vue",
  "theme": "material",
  "tabSize": 2
}
```
