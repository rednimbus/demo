const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const base = {
    css: /\.css$/,
    sass: /\.s(a|c)ss$/,
    less: /\.less$/,
    stylus: /\.styl(us)?$/,
}

const cssLoaders = (env) => {
    return Object.keys(base).map(l => {
        const use = [
            env === 'production' ? MiniCssExtractPlugin.loader: 'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: { 
                        path: path.join(__dirname, '../../.postcssrc.js') 
                    } 
                }
            }
        ]
        if (l !== 'css') {
            use.push(`${l}-loader`)
        }
        return {
            test: base[l],
            use
        }
    })
}

module.exports.cssLoaders = cssLoaders;