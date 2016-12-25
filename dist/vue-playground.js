(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('codemirror'), require('vue')) :
  typeof define === 'function' && define.amd ? define(['codemirror', 'vue'], factory) :
  (global.VuePlayground = factory(global.CodeMirror,global.Vue));
}(this, (function (CodeMirror,Vue$1) { 'use strict';

CodeMirror = 'default' in CodeMirror ? CodeMirror['default'] : CodeMirror;
Vue$1 = 'default' in Vue$1 ? Vue$1['default'] : Vue$1;

var Editor = {
  name: 'VueCodeMirror',

  props: ['value'],

  render: function render (h) {
    return h('textarea', null, this.value)
  },

  mounted: function mounted () {
    this.editor = CodeMirror.fromTextArea(this.$el, {
    });

    this.editor.on('change', this.handleChange);
  },

  methods: {
    handleChange: function handleChange () {
      this.$emit('change', this.editor.getValue());
    }
  }
};

var Preview = {
  name: 'preview',

  props: ['value'],

  render: function render (h) {
    return h('div', { class: 'preview' })
  },

  mounted: function mounted () {
    this.$watch('value', this.renderCode, { immediate: true });
  },

  methods: {
    renderCode: function renderCode (val) {
      if (this.codeVM) {
        this.codeVM.$destroy();
        this.codeVM.$el.parentNode && this.$el.removeChild(this.codeVM.$el);
      }

      this.codeEl = document.createElement('div');
      this.$el.appendChild(this.codeEl);
      this.codeVM = new Vue$1(val).$mount(this.codeEl);
    }
  }
};

var parser = function (input) {
  var html = document.createElement('div');

  html.innerHTML = input;

  try {
    return {
      template: html.querySelector('template').innerHTML,
      script: html.querySelector('script').innerHTML,
      styles: Array.prototype.slice.call(html.querySelectorAll('style')).map(function (n) { return n.innerHTML; }),
      content: html.innerHTML
    }
  } catch (e) {
    return { error: e }
  }
};

var MODULE_REGEXP = /(export\sdefault|modules.export)/;

var compiler = function (ref) {
  var template = ref.template;
  var script = ref.script;
  var styles = ref.styles;

  // TODO: styles

  script = script.trim();

  // Not exist template or render function
  if (!/template:|render:|render\(/.test(script)) {
    script = script.replace(/}.*?$/, (", template: `" + (template.trim()) + "`}"));
  }

  try {
    // https://www.npmjs.com/package/babel-standalone
    if (typeof Babel !== 'undefined') {
      script = Babel.transform(script, { // eslint-disable-line
        presets: [['es2015', { 'loose': true, 'modules': false }], 'stage-2']
      }).code;
    }

    script = script.replace(MODULE_REGEXP, '').replace(/;$/g, '');

    return { result: new Function('return ' + script)() }// eslint-disable-line
  } catch (e) {
    return { error: e }
  }
};

var Playground$1 = {
  name: 'VuePlayground',

  props: {
    template: {
      type: String,
      required: true
    }
  },

  data: function data () {
    return {
      content: '',
      preview: '',
      error: ''
    }
  },

  render: function render (h) {
    return h('div', {}, [
      h(Editor, {
        props: {
          value: this.content
        },
        on: {
          change: this.executeCode
        }
      }),
      h(Preview, {
        props: {
          value: this.preview
        }
      }),
      h('div', null, [this.error])
    ])
  },

  created: function created () {
    var content = this.template;

    if (/^[\.#]/.test(this.template)) {
      if (this.$isServer) { return }
      var html = document.querySelector(this.template);
      if (!html) { throw Error(((this.template) + " is not found")) }

      content = html.innerHTML;
    }

    this.executeCode(content);
  },

  methods: {
    executeCode: function executeCode (code) {
      this.error = '';
      var result = parser(code);

      if (result.error) {
        this.error = result.error.toString();
        return
      }

      var compiledCode = compiler(result);

      if (compiledCode.error) {
        this.error = compiledCode.error.toString();
        return
      }

      this.content = result.content;
      this.preview = compiledCode.result;
    }
  }
};

function install (Vue) {
  Vue.component(Playground$1.name, Playground$1);
}

Playground$1.install = install;

if (typeof Vue !== 'undefined') {
  Vue.use(install); // eslint-disable-line
}

return Playground$1;

})));
