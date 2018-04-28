(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue/dist/vue.common')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue/dist/vue.common'], factory) :
  (factory((global.Vuep = global.Vuep || {}),global.Vue));
}(this, (function (exports,Vue$1) { 'use strict';

Vue$1 = 'default' in Vue$1 ? Vue$1['default'] : Vue$1;

var index = function (target) {
  var arguments$1 = arguments;

  for (var i = 1; i < arguments.length; i++) {
    var source = arguments$1[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var assign = Object.assign || index;

var DEFAULT_OPTIONS = {
  lineNumbers: true,
  mode: 'text/x-vue',
  theme: 'material',
  tabSize: 2
};

var Editor = {
  name: 'VueCodeMirror',

  props: ['value', 'options'],

  render: function render (h) {
    return h('div', null, [
      h('textarea', { ref: 'textarea' }, this.value)
    ])
  },

  mounted: function mounted () {
    this.currentOptions = assign({}, DEFAULT_OPTIONS, this.options);
    var codemirror = require('codemirror');
    require('codemirror/addon/mode/overlay');
    require('codemirror/addon/mode/simple');
    require('codemirror/mode/css/css');
    require('codemirror/mode/htmlmixed/htmlmixed');
    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/vue/vue');
    require('codemirror/mode/xml/xml');
    require('codemirror/mode/jsx/jsx');
    this.editor = codemirror.fromTextArea(this.$refs.textarea, this.currentOptions);
    this.editor.on('change', this.handleChange);
  },

  watch: {
    value: function value (val) {
      val !== this.editor.getValue() && this.editor.setValue(val);
    }
  },

  methods: {
    handleChange: function handleChange () {
      /* istanbul ignore next */
      this.$emit('change', this.editor.getValue());
    }
  }
};

var Preview = {
  name: 'preview',

  props: ['value', 'styles', 'keepData'],

  render: function render (h) {
    this.className = 'vuep-scoped-' + this._uid;

    return h('div', {
      class: this.className
    }, [
      this.scopedStyle ? h('style', null, this.scopedStyle) : ''
    ])
  },

  computed: {
    scopedStyle: function scopedStyle () {
      return this.styles
        ? insertScope(this.styles, ("." + (this.className)))
        : ''
    }
  },

  mounted: function mounted () {
    this.$watch('value', this.renderCode, { immediate: true });
  },

  methods: {
    renderCode: function renderCode (val) {
      var this$1 = this;

      var lastData = this.keepData && this.codeVM && assign({}, this.codeVM.$data);

      if (this.codeVM) {
        this.codeVM.$destroy();
        this.$el.removeChild(this.codeVM.$el);
      }

      this.codeEl = document.createElement('div');
      this.$el.appendChild(this.codeEl);

      try {
        var parent = this;
        this.codeVM = new Vue$1(assign({}, {parent: parent}, val)).$mount(this.codeEl);

        if (lastData) {
          for (var key in lastData) {
            this$1.codeVM[key] = lastData[key];
          }
        }
      } catch (e) {
        /* istanbul ignore next */
        this.$emit('error', e);
      }
    }
  }
};

function insertScope (style, scope) {
  var regex = /(^|\})\s*([^{]+)/g;
  return style.trim().replace(regex, function (m, g1, g2) {
    return g1 ? (g1 + " " + scope + " " + g2) : (scope + " " + g2)
  })
}

var parser = function (input) {
  var html = document.createElement('div');
  var content = html.innerHTML = input.trim();

  try {
    var template = html.querySelector('template');
    var script = html.querySelector('script');
    var styles = Array.prototype.slice.call(html.querySelectorAll('style')).map(function (n) { return n.innerHTML; });

    if (!template && !script && !styles.length) {
      return {
        content: content,
        script: content
      }
    }

    return {
      content: /<\/script>$/g.test(content) ? content : (content + '\n</script>'),
      template: template ? template.innerHTML : '',
      script: script ? script.innerHTML : '',
      styles: styles
    }
  } catch (error) {
    /* istanbul ignore next */
    return { error: error }
  }
};

var Vuep$1 = {
  name: 'Vuep',

  props: {
    template: String,
    options: {},
    keepData: Boolean,
    value: String,
    scope: Object
  },

  data: function data () {
    return {
      content: '',
      preview: '',
      styles: '',
      error: ''
    }
  },

  render: function render (h) {
    var this$1 = this;

    var win;

    /* istanbul ignore next */
    if (this.error) {
      win = h('div', {
        class: 'vuep-error'
      }, [this.error]);
    } else {
      win = h(Preview, {
        class: 'vuep-preview',
        props: {
          value: this.preview,
          styles: this.styles,
          keepData: this.keepData
        },
        on: {
          error: this.handleError
        }
      });
    }

    return h('div', { class: 'vuep' }, [
      h(Editor, {
        class: 'vuep-editor',
        props: {
          value: this.content,
          options: this.options
        },
        on: {
          change: [this.executeCode, function (val) { return this$1.$emit('input', val); }]
        }
      }),
      win
    ])
  },

  watch: {
    value: {
      immediate: true,
      handler: function handler (val) {
        val && this.executeCode(val);
      }
    }
  },

  created: function created () {
      /* istanbul ignore next */
    if (this.$isServer) { return }
    var content = this.template;

    if (/^[\.#]/.test(this.template)) {
      var html = document.querySelector(this.template);
      if (!html) { throw Error(((this.template) + " is not found")) }

      /* istanbul ignore next */
      content = html.innerHTML;
    }

    if (content) {
      this.executeCode(content);
      this.$emit('input', content);
    }
  },

  methods: {
    handleError: function handleError (err) {
      /* istanbul ignore next */
      this.error = err;
    },

    executeCode: function executeCode (code) {
      this.error = '';
      var result = parser(code);

      /* istanbul ignore next */
      if (result.error) {
        this.error = result.error.message;
        return
      }

      var compiler = require('../src/utils/compiler.js').default;
      var compiledCode = compiler(result, this.scope);

      /* istanbul ignore next */
      if (compiledCode.error) {
        this.error = compiledCode.error.message;
        return
      }

      this.content = result.content;
      this.preview = compiledCode.result;
      if (compiledCode.styles) { this.styles = compiledCode.styles; }
    }
  }
};

Vuep$1.config = function (opts) {
  Vuep$1.props.options.default = function () { return opts; };
};

function install (Vue, opts) {
  Vuep$1.config(opts);
  Vue.component(Vuep$1.name, Vuep$1);
}

Vuep$1.install = install;

if (typeof Vue !== 'undefined') {
  Vue.use(install); // eslint-disable-line
}

Object.defineProperty(exports, '__esModule', { value: true });

})));
