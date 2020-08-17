const path = require('path')

const basePath = 'src'

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    basePath,
    alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve(basePath),
        '@assets': resolve('/src/assets'),
        '@common': resolve('/src/common'),
        '@components': resolve('/src/components'),
        '@utils': resolve('/src/common/utils'),
    },
    publicPath: '',
    devProxy: [
        {
            context: ['/scenicSpot'],
            target: 'http://10.200.3.51:6026/user-api',
            changeOrigin: true,
        },
        {
            context: ['/weshopclient'],
            target: 'https://yjy.joyuai.com/',
            changeOrigin: true,
        },
        {
            context: ['/city-marketing-api-h5-app'],
            target: 'https://yjy.joyuai.com/',
            changeOrigin: true,
        },
        {
            context: ['/zhiyu/travelInfo'],
            target: 'https://m.lvmama.com/',
            changeOrigin: true,
        },
        {
            context: ['/user-api'],
            target: 'https://hhy.joyuai.com/',
            changeOrigin: true,
        },
        // {
        //     context: ['/user-api'],
        //     target: 'http://10.52.2.20:6026/',
        //     changeOrigin: true
        // },
        {
            // **** 20/08/04 景区指南 ****
            context: ['/afanti-api'],
            target: 'https://hhy.joyuai.com/',
            changeOrigin: true,
        },
        {
            // **** 20/08/11 CMS ****
            context: ['/jtour-yjy-client'],
            target: 'https://hhy.joyuai.com/',
            changeOrigin: true,
        },
        {
            // **** 20/08/12 景区指南 ****
            context: ['/user-api'],
            target: 'https://hhy.joyuai.com/',
            changeOrigin: true,
        },
        {
            context: ['/city-marketing-api-h5-app'],
            target: 'https://yjy.joyuai.com/',
            changeOrigin: true,
        },
        {
            context: ['/zhiyu/travelInfo'],
            target: 'https://m.lvmama.com/',
            changeOrigin: true,
        },
        {
            context: ['/ms-api'],
            target: 'https://mind.lvmama.com/',
            changeOrigin: true,
        },
    ],
}
