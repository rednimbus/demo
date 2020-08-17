const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const baseConfig = require('../config');

const config = {
    target: 'web',
    mode: process.env.NODE_ENV || 'development',
    entry: {},
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: file => {
                    // resize-detector
                    return /node_modules/.test(file) && !/resize\-detector/.test(file) && !/pinyin/.test(file);
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 1000, // 图片尽量走url
                    name: '[name].[ext]',
                    outputPath: 'assets',
                    publicPath: 'assets',
                    postTransformPublicPath: (p) => {
                        if(process.env.NODE_ENV === 'development') {
                            return `"/${p.slice(1, p.length - 1)}"`;
                        }
                        return p;
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 1000, // 图片尽量走url
                    name: '[name].[ext]',
                    outputPath: 'assets',
                    publicPath: 'assets',
                    postTransformPublicPath: (p) => {
                        if(process.env.NODE_ENV === 'development') {
                            return `"/${p.slice(1, p.length - 1)}"`;
                        }
                        return p;
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 1000, // 图片尽量走url
                    name: '[name].[ext]',
                    outputPath: 'assets',
                    publicPath: 'assets',
                    postTransformPublicPath: (p) => {
                        if(process.env.NODE_ENV === 'development') {
                            return `"/${p.slice(1, p.length - 1)}"`;
                        }
                        return p;
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: baseConfig.alias
    },
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'moment': 'moment',
        'js-md5': 'md5',
        'weui.js': 'weui',
        'vue-lazyload': 'VueLazyload',
        'fastclick': 'FastClick',
        'vue-i18n': 'VueI18n',
        'vconsole': 'VConsole'
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ],
    stats: 'errors-only'
};

module.exports = config;
