const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
	entry: toObject(glob.sync('./src/**/*.js*'),'./src'),  
	output: {
		path: path.resolve(__dirname,'www'),
        filename: '[name].js',
        chunkFilename: '[chunkhash].module.js'
    },
	plugins: [
        new CleanWebpackPlugin(['www']),
        new CopyWebpackPlugin([{
          from: 'src/**/*.html',
          to: '[name].[ext]'
        }]),
        new CopyWebpackPlugin([{
          from: 'src/assets/img/*.png',
          to: 'assets/img/[name].[ext]'
        },{
          from: 'src/assets/img/*.jpg',
          to: 'assets/img/[name].[ext]'
        },{
          from: 'src/assets/css/*.css',
          to: 'assets/css/[name].[ext]'
        },{
          from: 'src/assets/fonts/*.*',
          to: 'assets/fonts/[name].[ext]'
        }]),
        new UglifyJSPlugin(),

    ],
    resolve:{
        extensions: ['.js', '.styl', '.css']
    },
	module: {
		rules: [
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env'],
                        plugins: [
                            'syntax-dynamic-import',
                            ["transform-runtime", {
                                "helpers": false,
                                "polyfill": false,
                                "regenerator": true,
                                "moduleName": "babel-runtime"
                              }]
                        ]
                    },
                    
                }    
            },
            {
                test: /\.html$/,
                include: /src/,
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }
            },
            {
                test: /\.styl$/,
                include: /src/,
                use: [
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'stylus-loader'
                    }
                ]
                
            }
        ]
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
}

function toObject(paths,exclude) {	
  let ret = {};
  paths.forEach(function(path) {
	var a = path.split('/')
	var dir = a.slice(0,a.length-1).join('/')+'/'
	var name = a[a.length-1].split('.')
    ret[dir.replace(exclude,'.') + name.slice(0,name.length-1).join('.')] = path
  })

  return ret
}