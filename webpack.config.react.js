const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const packageJson = require('./package.json');
  const version = packageJson.version;
  
  const banner = `/*! ${packageJson.name} React - ${version} */`;

  return {
    name: 'react',
    entry: './react/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'easel-react.min.js' : 'easel-react.js',
      library: {
        name: 'EaselReact',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this'
    },
    externals: {
      'react': {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM'
      }
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  modules: false,
                  targets: {
                    browsers: ["> 1%", "last 2 versions", "not ie <= 10"]
                  }
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: /^!/,
            },
          },
        })
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner,
        raw: true
      })
    ]
  };
};
