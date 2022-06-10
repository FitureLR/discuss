const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".json"]
  }
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // include: [path.resolve(__dirname, "app")],
        exclude: "/node_modules/",
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "index.html" })],
};
