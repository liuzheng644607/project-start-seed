const Path = require('path');
const HappyPack = require('happypack');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const fs = require('fs');
const ejs = require('ejs');
const config = require('config');
const root = config.get('root');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const htmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = './static';
const publicPath = '/';

module.exports = {
  devtool: false,
  entry: {
    app: './src/client/app.tsx'
  },
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: Path.resolve(root, outputPath),
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['jsnext:main', 'browser', 'main'],
    alias: {
      '@src': Path.resolve(root, './src'),
      '@client': Path.resolve(root, './src/client'),
      '@server': Path.resolve(root, './src/server'),
      '@utils': Path.resolve(root, './src/client/utils'),
      react: Path.resolve(
        root,
        `./node_modules/react/umd/react.development.js`
      ),
      'react-dom': Path.resolve(
        root,
        `./node_modules/react-dom/umd/react-dom.development.js`
      ),
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    },
  },
  module: {
    noParse: [/react\..+\.js$/],
    rules: [
      {
        test: /\.tsx?$/,
        use: ['happypack/loader?id=ts'],
        include: [Path.resolve('src/client')]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [`file-loader?name=[name]_[hash:8].[ext]`]
      },
      {
        test: /\.svg$/,
        // 内嵌svg
        use: ['raw-loader']
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      templateContent: function() {
        const ejsTemplate = fs.readFileSync(Path.resolve(root, './src/client/template.ejs'), {
          encoding: 'utf8',
        });

        return ejs.render(ejsTemplate, {
          isDev: process.env.NODE_ENV === 'development',
        })
      },
      inject: true,
      minify: true
    }),
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'ts',
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            configFile: Path.resolve(root, 'src/client/tsconfig.json'),
            happyPackMode: true
          }
        }
      ]
    })
  ]
};
