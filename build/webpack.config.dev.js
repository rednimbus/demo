const {merge} = require('webpack-merge');

const baseConfig = require('./webpack.config.base');
const {cssLoaders} = require('./util');

const config = merge(baseConfig, {
    module: {
        rules: [].concat(cssLoaders('development'))
    }
});

module.exports = config;
