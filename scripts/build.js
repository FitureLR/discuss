const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const replace = require("@rollup/plugin-replace");

// see below for details on the options
const inputOptions = { input: "./src/index.ts" };
const outputOptions = {
  file: "dist/bundle.js",
  format: "iife",
  name: "cm",

  banner: "/* meteora lib */",
  footer: "/* --- */",
  // intro: 'const ENVIRONMENT = "production";',

  // treeShake: true,
  // sourcemap: true,
};

const extensions = [".ts", "js"];

const rollupConfig = {
  ...inputOptions,
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**", // 只编译我们的源代码
      extensions,
      // plugins: ["@babel/plugin-transform-typescript"],
    }),
    replace({
      preventAssignment: true,
      __DEV__: true,
    }),
  ],
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(rollupConfig);

  // bundle.cache.plugins = {
  //   //
  // };

  console.log(bundle.imports); // an array of external dependencies
  console.log(bundle.exports); // an array of names exported by the entry point
  console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
