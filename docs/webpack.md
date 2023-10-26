## \_interopRequireDefault

```js
// Modules in Common JS :
module.exports = function () {};

// Modules in ES6 :
export default function () {}
```

用以实现在 Node.js 中使用 ESModule

```js
function _interopRequireDefault(module) {
	const isCJSModule = module && module.__esModule,
		cjsStyedModule = { default: module };

	return isCJSModule ? module : cjsStyedModule;
}
```
