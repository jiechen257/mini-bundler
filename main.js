const fs = require("fs")
const { bundlerOptions } = require("./config/env.js");

const getBundlerOption = () => {
	const args = process.argv.slice(2);
	let BUNDLER = "webpack";

	if (args.length) {
		BUNDLER = args[0].split("=")[1];
	}

	console.log('current bundler: ', BUNDLER);

	return bundlerOptions[BUNDLER];
};

const main = () => {
	try {
		const content = fs.readFileSync('./examples/index.js', "utf-8")

		const { entry, outputPath, loadBundler } = getBundlerOption();
		loadBundler()(entry, outputPath);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

main();
