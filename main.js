const { bundlerOptions } = require("./config/env.js");

const getBundlerOption = () => {
	const args = process.argv.slice(2);
	let BUNDLER = "webpack";

	if (args.length) {
		BUNDLER = args[0].split("=")[1];
	}

	return bundlerOptions[BUNDLER];
};

const main = () => {
	try {
		const { entry, outputPath, loadBundler } = getBundlerOption();
		console.log(outputPath);
		loadBundler()(entry, outputPath);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

main();
