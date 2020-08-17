const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

const {compilerArgu} = require('./util');
const config = require('../config');
const { libs, styles } = require('../config/template');

let webpackConfig = require('./webpack.config.dev');
const taskList = compilerArgu(process.argv.slice(2));
console.log('server tasks：', taskList.toString());
const [pages, plugins, rewrites] = [{}, [], []];

taskList.forEach((task) => {
    // 反斜杠替换为正斜杠
    task = task.replace(/\\/g, '/');
    const pathToPage = task.replace(`${config.basePath}/`, '');

    pages[task] = path.join(__dirname, `../${task}/main.js`)
    pageConfig = require(path.join(__dirname, `../${task}/config.json`));
    plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../config/template/template.html'),
            filename: `${pathToPage}/index.html`,
            chunks: [task],
            inject: true,
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
        })
    )

    if (pageConfig.mode.toLowerCase() === 'spa' && pageConfig.spaMode && pageConfig.spaMode.toLowerCase() === 'history') {
        const pRG = new RegExp('^\\/' + pathToPage.replace('/', '\\/') + '\\/');
        rewrites.push({ from: pRG, to: `/${pathToPage}` });
    }
});
webpackConfig = merge(webpackConfig, {
    entry: pages,
    plugins,
    output: {
        chunkFilename: '[name].[hash:6].js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, '../dev'),
        clientLogLevel: 'none',
        headers: {'Access-Control-Allow-Origin': '*'},
        hot: true,
        overlay: {
            errors: true,
            warnings: true
        },
        proxy: config.devProxy,
        historyApiFallback: {
            rewrites
        }
    }
})

const compiler = webpack(webpackConfig);

const openPage = taskList[0].replace(/\\/g, '/').replace(`${config.basePath}/`,'');
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
  open: true,
  openPage,
  stats: {
    colors: true,
  },
});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(8000, () => {
  console.log('Starting server on http://localhost:8080');
});
