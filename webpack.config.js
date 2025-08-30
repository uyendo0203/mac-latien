/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const environment = require('./configuration/environment');
const environment_pages = require('./configuration/environment');

const templateFiles = fs.readdirSync(environment_pages.paths.pages)
  .filter((file) => ['.html', '.twig'].includes(path.extname(file).toLowerCase())).map((filename) => ({
    input: filename,
    output: filename.replace(/\.twig$/, '.html'),
  }));

const htmlPluginEntries = templateFiles.map((template) => new HTMLWebpackPlugin({
  inject: true,
  hash: false,
  filename: template.output,
  template: path.resolve(environment_pages.paths.pages, template.input),
  // favicon: path.resolve(environment.paths.source, 'images', 'favicon.png'),
}));

module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, 'scss', 'app.scss'),
    "bg-image": path.resolve(environment.paths.source, 'scss', 'bg-image.scss'),
    "news": path.resolve(environment.paths.source, 'scss', 'news.scss'),
    "trainghiem": path.resolve(environment.paths.source, 'scss', 'trainghiem.scss')
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Chỉ giữ dòng này
    filename: '[name].js',
  },
  module: {
    rules: [{
        test: /\.twig$/,
        use: [
          "raw-loader",
          {
            loader: "twig-html-loader",
            options: {
              data: {},
            },
          },
        ],
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader',
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`, even if `sass-embedded` is available
              implementation: require("sass"),
            },
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/noneed/[name][ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', {
                interlaced: true
              }],
              ['jpegtran', {
                progressive: true
              }],
              ['optipng', {
                optimizationLevel: 5
              }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [{
                    name: 'removeViewBox',
                    active: false,
                  }, ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      // filename: 'css/[name].[contenthash].css',
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [{
          from: path.resolve(environment.paths.source, 'images'),
          to: path.resolve(environment.paths.output, 'images'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
        {
          from: path.resolve(environment.paths.source, 'libs'),
          to: path.resolve(environment.paths.output, 'libs'),
          toType: 'dir',
        },
        {
          from: path.resolve(environment.paths.source, 'js/common.js'),
          to: path.resolve(environment.paths.output, 'js/'),
          toType: 'dir',
        },
        {
          from: path.resolve(environment.paths.source, 'js/home.js'),
          to: path.resolve(environment.paths.output, 'js/'),
          toType: 'dir',
        },
        {
          from: path.resolve(environment.paths.source, 'js/news.js'),
          to: path.resolve(environment.paths.output, 'js/'),
          toType: 'dir',
        },
        {
          from: path.resolve(environment.paths.source, 'js/trainghiem.js'),
          to: path.resolve(environment.paths.output, 'js/'),
          toType: 'dir',
        },
      ],
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};