const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const glob = require('glob');

// Get all plugin files in proper order
const getPluginFiles = () => {
  // Base plugin files that must be loaded first
  const baseFiles = [
    './src/plugins/BaseTool.js',
    './src/plugins/BaseBrush.js',
    './src/plugins/BaseShape.js',
    './src/plugins/BaseOptionTool.js',
    './src/plugins/BaseTextOptionTool.js'
  ];
  
  // Get all other plugin files
  const allPluginFiles = glob.sync('./src/plugins/**/*.js');
  
  // Filter out base files and CSS files
  const otherPlugins = allPluginFiles.filter(file => 
    !baseFiles.includes(file) && !file.endsWith('.css')
  );
  
  return [...baseFiles, ...otherPlugins];
};

// Get toolbar files
const getToolbarFiles = () => {
  return glob.sync('./src/toolbars/**/*.js');
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const packageJson = require('./package.json');
  const version = packageJson.version;
  
  const banner = `/*! ${packageJson.name} - ${version} */`;

  // file order IS IMPORTANT
  const libraries = [
    './lib/fabric.1.7.1.js'
  ];

  const coreSources = [
    './src/Globals.js',
    './src/Localization_en.js',
    './src/Canvas.js',
    './src/Util.js',
    './src/Easel.Api.js',
    './src/Easel.ObjectApi.js',
    './src/Easel.js',
    './src/Easel.DefaultOptions.js',
    './src/Easel.Events.js',
    './src/Easel.Storage.js'
  ];

  const fabricExtensions = [
    './src/fabricjs_extensions/ErasableMixin.js',
    './src/fabricjs_extensions/ErasableObject.js',
    './src/fabricjs_extensions/SegmentablePolygon.js',
    './src/fabricjs_extensions/PText.js',
    './src/fabricjs_extensions/ErasableText.js',
    './src/fabricjs_extensions/Arrow.js',
    './src/fabricjs_extensions/Clipping.js',
    './src/fabricjs_extensions/ErasableArrow.js',
    './src/fabricjs_extensions/ErasableImage.js',
    './src/fabricjs_extensions/ErasableLine.js',
    './src/fabricjs_extensions/ErasablePath.js',
    './src/fabricjs_extensions/ErasablePencilBrush.js',
    './src/fabricjs_extensions/ErasableRect.js',
    './src/fabricjs_extensions/FloatingControl.js',
    './src/fabricjs_extensions/Line.js',
    './src/fabricjs_extensions/PCircle.js',
    './src/fabricjs_extensions/PRect.js',
    './src/fabricjs_extensions/PDiamond.js',
    './src/fabricjs_extensions/PTriangle.js'
  ];

  const toolbarFiles = getToolbarFiles();
  const pluginFiles = getPluginFiles();

  const standaloneSources = [
    ...libraries,
    ...coreSources,
    ...fabricExtensions,
    ...toolbarFiles,
    ...pluginFiles
  ];

  const redactorSources = [
    ...libraries,
    './src/RedactorPlugin.js',
    ...coreSources,
    ...fabricExtensions,
    ...toolbarFiles,
    ...pluginFiles
  ];

  const baseConfig = {
    devServer: {
      static: {
        directory: path.join(__dirname, './'),
      },
      compress: true,
      port: 8081,
      host: '0.0.0.0',
      open: {
        target: ['/examples'],
      },
      hot: false,
      liveReload: true
    }
  };

  return [
    // Standalone build
    {
      devServer: {
        static: {
          directory: path.join(__dirname, './'),
        },
        compress: true,
        port: 8081,
        host: '0.0.0.0',
        open: {
          target: ['/examples'],
        },
        hot: false,
        liveReload: true
      },
      name: 'standalone',
      entry: './webpack-entry-standalone.js', // We'll create this
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'easel.standalone.min.js' : 'easel.standalone.js',
      },
      devtool: 'source-map',
      module: {
        rules: []
      },
      optimization: {
        concatenateModules: false, // Disable module concatenation
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
        }),
        new ESLintPlugin({
          extensions: ['js'],
          exclude: ['node_modules', 'lib', 'dist'],
          failOnError: false // Don't fail build on lint errors
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'assets',
              to: 'assets',
              globOptions: {
                ignore: ['**/fonts/**']
              }
            },
            {
              from: 'assets/fonts',
              to: '../fonts',
              globOptions: {
                ignore: ['**/*.!(woff)']
              }
            }
          ]
        })
      ]
    },
    
    // Redactor build
    {
      name: 'redactor',
      entry: './webpack-entry-redactor.js', // We'll create this
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'easel.redactor.min.js' : 'easel.redactor.js',
      },
      devtool: 'source-map',
      module: {
        rules: [
          // No need for babel-loader when using script-loader
        ]
      },
      optimization: {
        concatenateModules: false,
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
    },
    
    // CSS build
    {
      name: 'css',
      entry: './src/main-styles.js', // We'll create this entry point
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'temp.js' // This will be removed, we only need CSS
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader'
            ]
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: isProduction ? 'easel.min.css' : 'easel.css'
        }),
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: ['temp.js', 'temp.js.map']
        })
      ],
      optimization: {
        minimize: isProduction,
        minimizer: [
          new CssMinimizerPlugin()
        ]
      }
    }
  ];
};
