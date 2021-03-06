const path = require("path");
const merge = require("webpack-merge");
const BaseWebpackConfig = require("./webpack.base.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
// const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
// const SizePlugin = require("size-plugin");
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

module.exports = (merge(BaseWebpackConfig, {
  mode: "development",
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "../dist/development"),
    publicPath: "http://localhost:8080/"
  },

  module: {
    rules: [{
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [{
            loader: "babel-loader?cacheDirectory=true"
          },
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.tsx?$/,
        enforce: "pre",
        use: [{
            loader: "babel-loader"
          },
          // {
          //   loader: "ts-loader"
          // },
          // {
          //   loader: "tslint-loader",
          //   options: {
          //     configFile: "./tslint.yaml",
          //     tsConfigFile: "tsconfig.json"
          //   }
          // }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [{
            loader: "thread-loader",
            options: {
              workers: 2,
              workerNodeArgs: ["--max-old-space-size=2048"],
              workerParallelJobs: 100,
            }
          },
          {
            loader: "style-loader",
            options: {
              sourceMap: true,
              hmr: true
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              // exec: true,
              // sourceMap: true,
              // parser: 'postcss-js',
              plugins: loader => {
                return [
                  // require('postcss-import')(),
                  require("autoprefixer")({})
                ];
              }
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              sourceMap: true
            }
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: path.resolve(__dirname, "../src/styles/globalvariable.less")
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [{
            loader: "url-loader",
            options: {
              limit: (10 | 0) * (1024 | 0),
              fallback: "file-loader",
              outputPath: "images",
              name: "[hash:16].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
          }
        ]
      },
      {
        test: /\.mp4$/i,
        use: [{
          loader: "url-loader",
          options: {
            limit: (0 | 0) * (1024 | 0),
            fallback: "file-loader",
            outputPath: "video",
            name: "[hash:16].[ext]",
          }
        }]
      }
    ]
  },

  plugins: [
    new WriteFilePlugin(),

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../public/config.js"),
      to: path.resolve(__dirname, "../dist/development/config.js"),
      force: true
    }]),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "../development/index.html",
      inject: "body",
      title: "",

      hash: false,
      meta: {
        "http-equiv": "Content-Type",
        content: "text/html; charset=utf-8; IE=edge, chrome=1"
      },
      chunksSortMode: "none"
    }),

    new ScriptExtHtmlWebpackPlugin({
      defer: [/\/echarts.*\.js$/, /\/main.*\.js$/],
      preload: [/api\.js$/, /main.*\.js$/, /\/react.*\.js$/, /\/vendor.*\.js$/],
      defaultAttribute: "async"
    }),

    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["config.js"],
      append: false,
    }),

    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "../assets/document_logo.png"),
      prefix: 'icons/'
    }),

    new webpack.HotModuleReplacementPlugin(),

    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, "../src/sw.js"),
    // })
    // new SizePlugin(),

    new MomentLocalesPlugin({
      localesToKeep: ["zh-cn"],
    })
  ],

  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "../dist/development"),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.0.1',
        changeOrigin: true
      }
    }
  }
}))