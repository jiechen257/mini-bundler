const entry = "../examples/index.js";

const bundlerOptions = {
	webpack: {
		entry: entry,
		outputPath: "../dist/webpack-bundle.js",
		loadBundler: () => {
			return require("../packages/webpack/index");
		},
	},
	rollup: {
		entry: entry,
		outputPath: "../dist/rollup-bundle.js",
		loadBundler: () => {
			return require("../packages/rollup/index");
		},
	},
};

module.exports = { bundlerOptions };