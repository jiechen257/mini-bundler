(function (graph) {
  function require(module) {
    function localRequire(relativePath) {
      return require(graph[module].dependencies[relativePath]);
    }

    var exports = {};

    (function (require, exports, code) {
      eval(code);
    })(localRequire, exports, graph[module].code);

    return exports;
  }

  require('./src/index.js');
})({
  './src/index.js': {
    dependencies: { './child.js': './src/child.js' },
    code: 'use strict;var _child = require(./child.js);var family = this is our family, .concat(_child.son, , ).concat(_child.daughter);console.log(family);',
  },
  './src/child.js': {
    dependencies: {
      './mother.js': './src/mother.js',
      './father.js': './src/father.js',
    },
    code: 'use strict;Object.defineProperty(exports, __esModule, {  value: true});exports.son = exports.daughter = void 0;var _mother = _interopRequireDefault(require(./mother.js));var _father = _interopRequireDefault(require(./father.js));function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var daughter = exports.daughter = this is daughter-Rachel, and .concat(_father[default]);var son = exports.son = this is son-Joy, and .concat(_father[default]);',
  },
  './src/mother.js': {
    dependencies: { './grandpa.js': './src/grandpa.js' },
    code: 'use strict;Object.defineProperty(exports, __esModule, {  value: true});exports[default] = void 0;var _grandpa = require(./grandpa.js);var mother = this is mother-Alice with .concat(_grandpa.grandpa);var _default = exports[default] = mother;',
  },
  './src/father.js': {
    dependencies: { './grandpa.js': './src/grandpa.js' },
    code: 'use strict;Object.defineProperty(exports, __esModule, {  value: true});exports[default] = void 0;var _grandpa = require(./grandpa.js);var father = this is father-Tom with .concat(_grandpa.grandpa);var _default = exports[default] = father;',
  },
  './src/grandpa.js': {
    dependencies: {},
    code: 'use strict;Object.defineProperty(exports, __esModule, {  value: true});exports.grandpa = void 0;var grandpa = exports.grandpa = grandpa-Jimmy;',
  },
});
