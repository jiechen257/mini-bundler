// 文件路径是相对于项目根目录进行取值的
const entry = "./examples/index.js";

const bundlerOptions = {
	webpack: {
		entry: entry,
		outputPath: "./dist/webpack-bundle.js",
		loadBundler: () => {
			return require("../bundlers/webpack/index");
		},
	},
	rollup: {
		entry: entry,
		outputPath: "./dist/rollup-bundle.js",
		loadBundler: () => {
			return require("../bundlers/rollup/index");
		},
	},
};

module.exports = { bundlerOptions };
