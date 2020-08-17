const staticHost = 'https://cdn.jsdelivr.net/npm/'

exports.libs = {
    'fastclick': `${staticHost}fastclick@1.0.6/lib/fastclick.min.js`,
    'vue': `${staticHost}vue@2.6.11/dist/vue.runtime.min.js`,
    'axios': `${staticHost}axios@0.19.2/dist/axios.min.js`,
    'vue-router': `${staticHost}vue-router@3.4.3/dist/vue-router.min.js`,
    'vuex': `${staticHost}vuex@3.5.1/dist/vuex.min.js`,
    'vue-lazyload': `${staticHost}vue-lazyload@1.3.3/vue-lazyload.min.js`,
    'wx-sdk': 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'
};

exports.styles = {
    
}

// 升级插件版本，请升级version，并备注版本信息
// 通过cmd生成的版本查询：全局搜索 from cmd 版本号 例如：from cmd 1.0.0
exports.version = '1.0.0';
