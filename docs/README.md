# Demo
<vuep template="#demo1"></vuep>

<script v-pre type="text/x-template" id="demo1">
<style>
  .main {
    color: #2c3e50;
  }
  .text {
    color: #4fc08d;
  }
</style>

<template>
  <div class="main">
    <h2> Hello <span class="text">{{ name }}</span>!</h2>
    <h2>Features</h2>
    <ul>
      <li v-for="text in features">{{ text }}</li>
    </ul>
  </div>
</template>

<script>
  module.exports = {
    data () {
      return {
        name: 'Vuep',
        features: [
          'Single File Component',
          'Babel for ES6/JSX/UMD/CommonJS',
          'Scoped style',
          'Customizable JavaScript scope'
        ]
      }
    }
  }
</script>
</script>

<br>

# Usage

## CommonJS
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
<link rel="stylesheet" href="//unpkg.com/vuep/dist/vuep.css">

<!-- depend vue -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
```

template
```html
<vuep template="#example"></vuep>

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

The default is supported in docsify. such as https://qingwei-li.github.io/vuep/README.md

# Options

https://codemirror.net/index.html

## Global config
```javascript
Vue.use(Vuep /*, { codemirror config }*/)
```

## Props

```html
<vuep :options="{ theme: 'material' }"></vuep>
```

### Default config
```json
{
  "lineNumbers": true,
  "mode": "text/x-vue",
  "theme": "material",
  "tabSize": 2
}
```

### example

```html
<vuep :options="{ mode: 'javascript' }" template="#demo4"></vuep>

<script v-pre type="text/x-template" id="demo4">
  module.exports = {
    template: `<div>I'am {{ name }}</div>`,

    data: function () {
      return { name: 'cinwell' }
    }
  }
</script>
```

<vuep :options="{ mode: 'javascript' }" template="#demo4"></vuep>

<script v-pre type="text/x-template" id="demo4">
  module.exports = {
    template: `<div>I'am {{ name }}</div>`,

    data: function () {
      return { name: 'cinwell' }
    }
  }
</script>

<br>

## v-model

```html
<template>
  <vuep v-model="value"></vuep>
</template>

<script>
  export default {
    data: () => ({
      value: `module.exports = {
  template: '<div>I\\'am {{ name }}</div>',

  data: function () {
    return { name: 'cinwell' }
  }
}`
    })
  }
</script>
```

## JavaScript scope

You can customize JavaScript scope by setting an object to the scope property. 

This object can contain component from your app scope to include them into Vuep scope.

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
          'Single File Component',
          'Babel for ES6/JSX/UMD/CommonJS',
          'Scoped style',
          'Customizable JavaScript scope'
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

# FAQ
## How to change the default theme?

First you need load CodeMirror theme style, You can view the list of theme from [here](https://codemirror.net/demo/theme.html).

Such as in your HTML file
```html
<link rel="stylesheet" href="path/to/codemirror/theme/neo.css">
```

Or in your CSS file

```css
@import "codemirror/theme/neo.css"
```

Configure the options for the component

```html
<vuep :options="{ theme: 'neo' }"></vuep>
```

<vuep class="demo2" :options="{ theme: 'neo' }" template="#demo2"></vuep>

<script v-pre type="text/x-template" id="demo2">
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

## Can I use ES6?

I know you will worry that some browsers do not support ES6, but we have [babel-standalone](https://www.npmjs.com/package/babel-standalone).

> babel-standalone is a standalone build of Babel for use in non-Node.js environments, including browsers.

How to use:

In your HTML file

```html
<script src="https://unpkg.com/babel-standalone/babel.min.js"></script>
```

Done. Now you are free to use ES6, Vuep will compile them to ES5 through the babel.


<vuep template="#demo3"></vuep>

<script v-pre type="text/x-template" id="demo3">
<template>
  <div>
    <button @click="count++">+</button>
    <span>{{ count }}</span>
    <button @click="count--">-</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 0
      }
    }
  }
</script>
</script>

## Can I use JSX?

Sure.

```html
<script src="https://unpkg.com/babel-standalone/babel.min.js"></script>
<script src="https://unpkg.com/babel-plugin-transform-vue-jsx"></script>
```

<vuep template="#demo5" :options="{ mode: 'jsx'}"></vuep>

<script v-pre type="text/x-template" id="demo5">
  module.exports = {
    data() {
      return {
        count: 0
      }
    },
    render () {
      return (
        <div style={{ color: 'red' }}> { this.count } </div>
      )
    }
  }
</script>

## Can I use `require`?

Sure. if you use ES6 syntax you can even use `import`.

vuep implement a nodejs like synchrounous require interface in browser, so you can directly require a js file.

```jsx
/* remote.js */
export default {
  name: 'remote',
  render () {
    return <div>from remote</div>
  }
}
```

<vuep template="#demo6" :options="{ mode: 'jsx'}"></vuep>

<script v-pre type="text/x-template" id="demo6">
module.exports = {
  template: '<div><remote></remote></div>',
  components: {
    remote: require('remote.js') // or require('https://qingwei-li.github.io/vuep/remote.js')
  },
  data () {
    return {
      name: 'Vuep',
    }
  }
}
</script>


# Warning

If you use `script(type="text/x-template)"`, The script tag must be at the end, for example

```html
<script v-pre type="text/x-template">
  <style></style>
  <template></template>
  <script></script>
</script>
```

These will be parsed incorrectly
```html
<script v-pre type="text/x-template">
  <script></script>
  <style></style>
  <template></template>
</script>
```

```html
<script v-pre type="text/x-template">
  <style></style>
  <script></script>
  <template></template>
</script>
```
