const { merge } = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const baseConfig = require('./webpack.config.base');
const {cssLoaders} = require('./util');

const config = merge(baseConfig, {
    module: {
        rules: [].concat(cssLoaders('production'))
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': '"production"'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ]
});

module.exports = config;
