const path = require('path');
const rm = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { libs, styles } = require('../config/template');

const webpackConfig = require('./webpack.config.prod');
const config = require('../config');

let runnerConfig;
function excutor() {
    if (runnerConfig.taskList.length === 0) {
        if (!runnerConfig.debug) {
            process.send({ code:1 });
            process.exit(0);
        }
        return;
    }
    const originPath = runnerConfig.taskList.shift();  // 类似于 src/one    
    const tempBuildPath = path.resolve(__dirname, '../', originPath); // 绝对路径
    // 设置入口文件和输出路径
    webpackConfig.entry = path.resolve(`${tempBuildPath}${path.sep}main.js`);

    // 绝对路径转相对路径，例如："e:\website\static_project\webapp\src\testOnePage"  =》  "testOnePage"
    const relativePath = tempBuildPath.replace(path.resolve(__dirname, '../', config.basePath), '');

    webpackConfig.output.path = path.resolve(__dirname, '../dist', `.${relativePath}`);
    webpackConfig.output.publicPath = config.publicPath;
    const pageConfig = require(path.resolve(`${tempBuildPath}${path.sep}config.json`));
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist', `.${relativePath}`, 'index.html'),
        template: path.resolve(__dirname, '../config/template/template.html'),
        scriptLoading: 'defer',
        templateParameters: {
            'title': pageConfig.title || '',
            'headers': pageConfig.headers || [],
            'styles': pageConfig.styles ? pageConfig.styles.map(s => {
                if (styles[s]) return `<link rel="stylesheet" href="${styles[s]}">`;
                else return s;
            }) : [],
            'body': pageConfig.body || '',
            'libs': pageConfig.libs ? pageConfig.libs.map(lib => {
                if (libs[lib]) return `<script src="${libs[lib]}"></script>`;
                else return lib;
            }) : []
        }
    }));
    // 先删除，再执行build
    rm(path.resolve(__dirname, '../dist', `.${relativePath}`), err => {
        if (err) throw err;

        webpack(webpackConfig, (err, stats) => {
            if (err) throw err;
            process.stdout.write(`${stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            })}\n\n`);

            console.log(chalk.cyan(`${tempBuildPath}  Build complete.\n`));
            excutor();
        });
    });
}

process.on('message', (data) => {
    runnerConfig = data;
    excutor();
});

process.on('uncaughtException', err => {
    console.error('An uncaught error occurred!');
    console.error(err.stack);
    process.send({code: -1, err: err});
});


module.exports = function debug(data) {
    runnerConfig = data;
    excutor();
};
