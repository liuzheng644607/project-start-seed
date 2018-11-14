const Path = require('path');
const HappyPack = require('happypack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProd = process.env.NODE_ENV !== 'development';
const outputPath = './static';
const publicPath = '/';

module.exports = {
  entry: '',
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: Path.resolve(__dirname, outputPath),
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['jsnext:main', 'browser', 'main'],
    alias: {
      react: Path.resolve(
        __dirname,
        `./node_modules/react/umd/${
          isProd ? 'react.production.min.js' : 'react.development.js'
        }`
      ),
      'react-dom': Path.resolve(
        __dirname,
        `./node_modules/react-dom/umd/${
          isProd ? 'react-dom.production.min.js' : 'react-dom.development.js'
        }`
      ),
      '@src': Path.resolve(__dirname, './src')
    }
  },
  module: {
    noParse: [/react\..+\.js$/],
    rules: [
      {
        test: /\.tsx?$/,
        use: ['happypack/loader?id=ts'],
        include: [Path.resolve('src/client'), Path.resolve('src/common')]
      },
      {
        test: /\.css/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: ['happypack/loader?id=css']
            })
          : ['happypack/loader?id=css'],
        exclude: [Path.resolve(__dirname, 'src/client')]
      },
      {
        test: /\.css/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: ['happypack/loader?id=postcss']
            })
          : ['happypack/loader?id=postcss'],
        include: [Path.resolve(__dirname, 'src/client')]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [`file-loader${isProd ? '?name=[name]_[hash:8].[ext]' : ''}`]
      },
      {
        test: /\.svg$/,
        // 内嵌svg
        use: ['raw-loader']
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      chunks: ['common', 'base'],
      name: 'base'
    }),
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'ts',
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            configFile: 'src/client/tsconfig.json',
            happyPackMode: true
          }
        }
      ]
    }),
    new HappyPack({
      id: 'postcss',
      loaders: isProd
        ? ['css-loader?minimize', 'postcss-loader']
        : ['style-loader', 'css-loader', 'postcss-loader']
    }),
    new HappyPack({
      id: 'css',
      loaders: isProd ? ['css-loader?minimize'] : ['style-loader', 'css-loader']
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
      append: '\n//# sourceMappingURL=/[url]'
    })
  ].concat(
    isProd
      ? // 只在生成环境下启用的插件
        [
          new DefinePlugin({
            // 定义 NODE_ENV 环境变量为 production 去除 react 代码中的开发时才需要的部分
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
          }),
          new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css` // 给输出的 CSS 文件名称加上 hash 值
          }),
          // 压缩输出的 JS 代码
          new ParallelUglifyPlugin({
            sourceMap: true,
            uglifyJS: {
              output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false
              },
              compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true
              }
            }
          })
        ]
      : // 只在开发环境下启用的插件
        []
  )
};
