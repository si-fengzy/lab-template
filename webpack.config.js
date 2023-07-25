const { resolve } = require("node:path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const MainfestPlugin = require("./plugins/mainfest");

const packageInfo = require("./package.json");

module.exports = {
  mode: "production",
  entry: resolve(__dirname, "src", "main.ts"),
  output: {
    path: resolve(__dirname, packageInfo.name),
    filename: "[name]-[fullhash].js",
    clean: true,
  },
  optimization: {
    usedExports: false,
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.json?$/,
        use: "json-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({}),
    new HtmlWebpackPlugin({
      title: packageInfo.name,
      template: resolve(__dirname, "public", "index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/[name]-[fullhash].css",
    }),
    new MainfestPlugin(
      resolve(__dirname, "package.json"),
      resolve(__dirname, packageInfo.name),
      resolve(__dirname, "public", "img", packageInfo.themeImg)
    ),
  ],
  devServer: {
    hot: true,
  },
};
