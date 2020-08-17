const staticHost = 'https://pics.lvjs.com.cn/jtour/libs/'

exports.libs = {
    'fastclick': `${staticHost}fastclick.js`,
    'vue': `${staticHost}vue-2.5.16.js`,
    'axios': `${staticHost}axios-0.18.1.js`,
    'vue-router': `${staticHost}vue-router-3.07.js`,
    'vuex': `${staticHost}vuex-3.5.1.js`,
    'moment': `${staticHost}moment.min.js`,
    'js-md5': `${staticHost}md5.min.js`,
    'weui.js': `${staticHost}weui.min.js`,
    'vue-lazyload': `${staticHost}vue-lazyload.js`,
    'vue-i18n': `${staticHost}vue-i18n.min.js`,
    'wx-sdk': 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'
};

exports.styles = {
    
}

// 升级插件版本，请升级version，并备注版本信息
// 通过cmd生成的版本查询：全局搜索 from cmd 版本号 例如：from cmd 1.0.0
exports.version = '1.0.0';
