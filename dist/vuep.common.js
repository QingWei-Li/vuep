'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var CodeMirror = _interopDefault(require('codemirror'));
var Vue$1 = _interopDefault(require('vue/dist/vue.common'));

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
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, this.currentOptions);
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

  props: ['value', 'styles', 'keepData', 'iframe', 'fitIframe'],

  render: function render (h) {
    this.className = 'vuep-scoped-' + this._uid;

    return h(this.iframe ? 'iframe' : 'div', {
      class: this.className
    }, [
      this.scopedStyle ? h('style', null, this.scopedStyle) : ''
    ])
  },

  data: function data () {
    return {
      resizeDebounce: null
    }
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
    if (this.iframe) {
      this.$el.addEventListener('load', this.renderCode);
      this.bindIframe();
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.iframe) {
      this.$el.removeEventListener('load', this.renderCode);
      this.unbindIframe();
    }
  },
  methods: {
    renderCode: function renderCode () {
      var this$1 = this;

      // Firefox needs the iframe to be loaded
      if (this.iframe && this.$el.contentDocument.readyState !== 'complete') {
        return
      }

      var val = this.value;
      var lastData = this.keepData && this.codeVM && assign({}, this.codeVM.$data);
      var container = this.iframe ? this.$el.contentDocument.body : this.$el;

      if (this.codeVM) {
        this.codeVM.$destroy();
        container.removeChild(this.codeVM.$el);
      }

      this.codeEl = document.createElement('div');
      container.appendChild(this.codeEl);

      if (this.iframe) {
        var head = this.$el.contentDocument.head;
        if (this.styleEl) {
          head.removeChild(this.styleEl);
          for (var key in this$1.styleNodes) {
            head.removeChild(this$1.styleNodes[key]);
          }
        }
        this.styleEl = document.createElement('style');
        this.styleEl.appendChild(document.createTextNode(this.styles));
        this.styleNodes = [];
        var documentStyles = getDocumentStyle();
        for (var key$1 in documentStyles) {
          this$1.styleNodes[key$1] = documentStyles[key$1].cloneNode(true);
          head.appendChild(this$1.styleNodes[key$1]);
        }
        head.appendChild(this.styleEl);
      }

      try {
        var parent = this;
        this.codeVM = new Vue$1(assign({}, {parent: parent}, val)).$mount(this.codeEl);

        if (lastData) {
          for (var key$2 in lastData) {
            this$1.codeVM[key$2] = lastData[key$2];
          }
        }
      } catch (e) {
        /* istanbul ignore next */
        this.$emit('error', e);
      }

      if (this.iframe) {
        this.resizeIframeDebounce();
      }
    },
    bindIframe: function bindIframe () {
      this.$el.contentWindow.addEventListener(
        'resize',
        this.resizeIframeDebounce
      );
    },
    unbindIframe: function unbindIframe () {
      if (this.$el && this.$el.contentWindow) {
        this.$el.contentWindow.removeEventListener(
          'resize',
          this.resizeIframeDebounce
        );
      }
    },
    resizeIframeDebounce: function resizeIframeDebounce () {
      clearTimeout(this.resizeDebounce);
      this.resizeDebounce = setTimeout(this.resizeIframe, 100);
    },
    resizeIframe: function resizeIframe () {
      if (!this.fitIframe || !this.$el || !this.$el.contentWindow) {
        return
      }
      this.unbindIframe();
      var body = this.$el.contentWindow.document.body;
      if (body.children && body.children[0]) {
        var padding = getPadding(this.$el);
        var child = body.children[0];
        var oldOverflow = child.style.overflow;
        child.style.overflow = 'hidden';
        var childHeight = child.offsetHeight;
        child.style.overflow = oldOverflow;
        var bodyOffset = getPadding(body) + getMargin(body);
        this.$el.style.height = (childHeight + padding + bodyOffset) + "px";
      }
      setTimeout(this.bindIframe, 100);
    }
  }
};

function insertScope (style, scope) {
  var regex = /(^|\})\s*([^{]+)/g;
  return style.trim().replace(regex, function (m, g1, g2) {
    return g1 ? (g1 + " " + scope + " " + g2) : (scope + " " + g2)
  })
}

function getDocumentStyle () {
  var links = document.querySelectorAll('link[rel="stylesheet"]');
  var styles = document.querySelectorAll('style');
  return Array.from(links).concat(Array.from(styles))
}

function getPadding(e) {
  return getProperty(e, 'padding-top') + getProperty(e, 'padding-bottom')
}

function getMargin(e) {
  return getProperty(e, 'margin-top') + getProperty(e, 'margin-bottom')
}

function getProperty(e, p) {
  return parseInt(window.getComputedStyle(e, null).getPropertyValue(p))
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

var JSMODULE_REG = /\.((js)|(jsx))$/;

function require$1 (url) {
  if (JSMODULE_REG.test(url)) {
    return getAndCache(url)
  }
}

// modify from docsify: https://github.com/QingWei-Li/docsify/blob/master/src/core/fetch/ajax.js

var cache = {};

/**
 * Simple ajax get
 * @param {string} url
 * @return { then(resolve, reject), abort }
 */
function getAndCache (url) {
  var xhr = new XMLHttpRequest(); // eslint-disable-line

  if (cache[url]) {
    return cache[url]
  }

  xhr.open('GET', url, false);
  xhr.send();
  var script = xhr.responseText;
  cache[url] = evalJS(script);
  return cache[url]
}

window.require = require$1;

function evalJS (script, scope) {
  if ( scope === void 0 ) scope = {};

  // https://www.npmjs.com/package/babel-standalone
  /* istanbul ignore next */

  if (typeof Babel !== 'undefined') {
    var plugins = [];

    // Register jsx plugin
    if (window['babel-plugin-transform-vue-jsx']) {
      if (!Babel.availablePlugins['transform-vue-jsx']) { // eslint-disable-line
        Babel.registerPlugin('transform-vue-jsx', window['babel-plugin-transform-vue-jsx']); // eslint-disable-line
      }
      plugins.push('transform-vue-jsx');
    }

    script =  Babel.transform(script, { // eslint-disable-line
      presets: [['es2015', { 'loose': true }], 'stage-2'],
      plugins: plugins,
      comments: false
    }).code;
  }

  var scopeDecl = '';
  for (var variable in scope) {
    if (scope.hasOwnProperty(variable)) {
      scopeDecl += 'var ' + variable + ' = __vuep[\'' + variable + '\'];';
    }
  }

  script = "(function(exports){var module={};module.exports=exports;" + scopeDecl + ";" + script + ";return module.exports.__esModule?module.exports.default:module.exports;})({})";
  var result = new Function('__vuep', 'return ' + script)(scope) || {}; // eslint-disable-line
  return result
}

var compiler = function (ref, scope) {
  var template = ref.template;
  var script = ref.script; if ( script === void 0 ) script = 'module.exports={}';
  var styles = ref.styles;
  if ( scope === void 0 ) scope = {};

  try {
    if (script === 'module.exports={}' && !template) { throw Error('no data') }
    var result = evalJS(script, scope);
    if (template) {
      result.template = template;
    }
    return {
      result: result,
      styles: styles && styles.join(' ')
    }
  } catch (error) {
    return { error: error }
  }
};

var Vuep$2 = {
  name: 'Vuep',

  props: {
    template: String,
    options: {},
    keepData: Boolean,
    value: String,
    scope: Object,
    iframe: Boolean,
    fitIframe: Boolean
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
          keepData: this.keepData,
          iframe: this.iframe,
          fitIframe: this.fitIframe
        },
        on: {
          error: this.handleError
        }
      });
    }

    var editor = h(Editor, {
      class: 'vuep-editor',
      props: {
        value: this.content,
        options: this.options
      },
      on: {
        change: [this.executeCode, function (val) { return this$1.$emit('input', val); }]
      }
    });

    var children = [editor, win];
    if (this.$slots.default) {
      children = this.addSlots(h, this.$slots.default, [
        {
          name: 'vuep-preview',
          child: win
        },
        {
          name: 'vuep-editor',
          child: editor
        }
      ]);
    }
    return h('div', { class: 'vuep' }, children)
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
    addSlots: function addSlots (h, vnodes, slots) {
      var this$1 = this;

      return vnodes.map(function (vnode) {
        var children = [];
        slots.forEach(function (ref) {
          var name = ref.name;
          var child = ref.child;

          if (vnode.data && vnode.data.attrs && vnode.data.attrs[name] !== undefined) {
            children = [child];
          }
        });
        if (!children.length && vnode.children && vnode.children.length) {
          children = this$1.addSlots(h, vnode.children, slots);
        }
        return h(vnode.tag, vnode.data, children)
      })
    },

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
