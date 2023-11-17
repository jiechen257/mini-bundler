const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");
const prettier = require("prettier");

const moduleAnalyser = async (filename) => {
	// 入口分析，通过入口拿到对应的依赖+可执行的代码code

	// 通过fs读取本地文件
	const content = fs.readFileSync(filename, "utf-8");

	// 通过babel转化content为ast
	const ast = parser.parse(content, {
		sourceType: "module",
	});

	// 通过ast拿到所有依赖的关系
	const dependencies = {};
	traverse(ast, {
		ImportDeclaration({ node }) {
			const relativePath = node.source.value;
			const dirname = path.dirname(filename);
			const absolutePath = "./" + path.join(dirname, relativePath);
			dependencies[relativePath] = absolutePath;
		},
	});

	// 通过babel拿到可执行的code
	const { code } = babel.transformFromAst(ast, null, {
		presets: ["@babel/preset-env"],
	});

	return {
		filename: filename,
		dependencies: dependencies,
		code: code,
	};
};

const makeDependenciesGraph = async (entry) => {
	// 首先拿到入口的依赖对象
	const entryModule = await moduleAnalyser(entry);
	const graph = {};

	const graphArray = [entryModule];
	// BFS遍历
	for (let i = 0; i < graphArray.length; i++) {
		// 找每一个entryModule的依赖，递归调用，形成一个对象
		const { dependencies } = graphArray[i];
		if (dependencies) {
			for (let key in dependencies) {
				graphArray.push(await moduleAnalyser(dependencies[key]));
			}
		}
	}

	// 将数组的形式转化为对象
	for (let i in graphArray) {
		const { filename, dependencies, code } = graphArray[i];
		graph[filename] = {
			dependencies,
			code,
		};
	}
	return graph;
};

const generateCode = async (entry) => {
	// 使用闭包形成局部作用域

	// ESModule的require和exports是没有的，需要重写

	// 1. 拿到可执行的代码传入闭包
	const graph = JSON.stringify(await makeDependenciesGraph(entry));

	return `
    (function(graph) {

        function require(module) {

            function localRequire(relativePath) {
                return require(graph[module].dependencies[relativePath]);
            }

            var exports = {};

            (function(require, exports, code){
                eval(code);
            })(localRequire, exports, graph[module].code);

            return exports;
        }

        require('${entry}');

    })(${graph});
    `;
};

const formatAndWriteCode = async (inputCode, outputPath) => {
	// 去除转义字符
	const regex = /\\./g;
	const unescapedCode = inputCode.replace(regex, "");

	// 格式化代码
	const formattedCode = await prettier.format(unescapedCode, {
		semi: true,
		singleQuote: true,
		trailingComma: "all",
		parser: "babel",
	});

	// 创建目录（如果目录不存在）
	const directory = path.dirname(outputPath);
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
	// 写入文件
	fs.writeFileSync(outputPath, formattedCode);
};

const webpack = async (entry, outputPath) => {
	const code = await generateCode(entry);
	await formatAndWriteCode(code, outputPath);
};

module.exports = webpack;
