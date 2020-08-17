const fs = require('fs');
const path = require('path');

const config = require('../../config');

function validateCmdParam(params, mode) {
    let result = true;
    if (params.length === 0) {
        if (mode === 'build') {
            console.log('参数不能为空，正确的格式为：node build/build pagePath');
        } else if (mode === 'dev') {
            console.log('参数不能为空，正确的格式为：node build/dev-server pagePath');
        } else if (mode === 'test') {
            console.log('参数不能为空，正确的格式为：node build/karma pagePath');
        }
        result = false;
    } else if (params.length > 0 && params[0].toLowerCase() !== 'all') {
        const absolutePath = path.resolve(config.basePath, params[0]);
        if (!fs.existsSync(absolutePath)) {
            console.log('路径不存在');
            result = false;
        }
    }
    return result;
};

exports.validateCmdParam = validateCmdParam;