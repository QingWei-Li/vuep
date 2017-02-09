'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var CodeMirror = _interopDefault(require('codemirror'));
var Vue$1 = _interopDefault(require('vue/dist/vue.common'));

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
    this.currentOptions = Object.assign({}, DEFAULT_OPTIONS, this.options);
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, this.currentOptions);
    this.editor.on('change', this.handleChange);
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

  props: ['value', 'styles'],

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
        ? this.styles.replace(/([\.#\w]+\w*?\s?{)/g, ("." + (this.className) + " $1"))
        : ''
    }
  },

  mounted: function mounted () {
    this.$watch('value', this.renderCode, { immediate: true });
  },

  methods: {
    renderCode: function renderCode (val) {
      if (this.codeVM) {
        this.codeVM.$destroy();
        this.$el.removeChild(this.codeVM.$el);
      }

      this.codeEl = document.createElement('div');
      this.$el.appendChild(this.codeEl);

      try {
        this.codeVM = new Vue$1(val).$mount(this.codeEl);
      } catch (e) {
        /* istanbul ignore next */
        this.$emit('error', e);
      }
    }
  }
};

var parser = function (input) {
  var html = document.createElement('div');

  html.innerHTML = input;

  var content = input;

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
      content: content,
      template: template ? template.innerHTML : '',
      script: script ? script.innerHTML : '',
      styles: styles
    }
  } catch (e) {
    /* istanbul ignore next */
    return { error: e }
  }
};

var MODULE_REGEXP = /(export\sdefault|modules.export\s?=)/;

var compiler = function (ref) {
  var template = ref.template;
  var script = ref.script; if ( script === void 0 ) script = '{}';
  var styles = ref.styles;

  // Not exist template or render function
  if (!/template:|render:|render\(/.test(script) && template) {
    script = script.trim().replace(/}$/, (", template: `" + (template.trim()) + "`}"));
  }

  // fix { , template: '...' } => { template: '...' }
  script = script.replace(/{\s*?,/, '{');

  try {
    if (script === '{}') { throw Error('no data') }

    // https://www.npmjs.com/package/babel-standalone
    /* istanbul ignore next */
    if (typeof Babel !== 'undefined') {
      script = Babel.transform(script, { // eslint-disable-line
        presets: [['es2015', { 'loose': true, 'modules': false }], 'stage-2'],
        plugins: ['transform-vue-jsx']
      }).code;
    }

    script = script.replace(MODULE_REGEXP, '').replace(/;$/g, '');

    return {
      result: new Function('return ' + script.trim())(), // eslint-disable-line
      styles: styles && styles.join(' ')
    }
  } catch (e) {
    return { error: e }
  }
};

var Vuep$2 = {
  name: 'Vuep',

  props: {
    template: {
      type: String,
      required: true
    },
    options: {}
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
          styles: this.styles
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
          change: this.executeCode
        }
      }),
      win
    ])
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

    this.executeCode(content);
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

      var compiledCode = compiler(result);

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

Vuep$2.config = function (opts) {
  Vuep$2.props.options.default = function () { return opts; };
};

function install (Vue, opts) {
  Vuep$2.config(opts);
  Vue.component(Vuep$2.name, Vuep$2);
}

Vuep$2.install = install;

if (typeof Vue !== 'undefined') {
  Vue.use(install); // eslint-disable-line
}

if (typeof require !== 'undefined') {
  require('codemirror/addon/mode/overlay');
  require('codemirror/addon/mode/simple');
  require('codemirror/mode/css/css');
  require('codemirror/mode/htmlmixed/htmlmixed');
  require('codemirror/mode/javascript/javascript');
  require('codemirror/mode/vue/vue');
  require('codemirror/mode/xml/xml');
  require('codemirror/mode/jsx/jsx');
}

module.exports = Vuep$2;
