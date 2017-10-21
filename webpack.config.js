
'use strict';

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");  //css单独打包
var progressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: __dirname + '/src/index.js', //唯一入口文件
    output: {
        path: __dirname + '/build', //打包后的文件存放的地方
        publicPath: '/build/',
        filename: 'main.js' //打包后输出文件的文件名
    },

    module: {
        loaders: [
            { 
                test: /\.js$/, 
                loader: "jsx!babel", 
                include: /src/
            },
            { 
                test: /\.css$/, 
                loader: ExtractTextPlugin.extract("style", "css!postcss")
            },
            { 
                test: /\.scss$/, 
                loader: ExtractTextPlugin.extract("style", "css!postcss!sass")
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },

    postcss: [
        require('autoprefixer')    //调用autoprefixer插件,css3自动补全
    ],

    devServer: {
        contentBase: './src',  //本地服务器所加载的页面所在的目录
        port: 8080,
        colors: true,  //终端中输出结果为彩色
        historyApiFallback: true,  //不跳转
        inline: true  //实时刷新
    },

    plugins: [
        new ExtractTextPlugin('main.css'),
        new progressBarPlugin()
    ]
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}