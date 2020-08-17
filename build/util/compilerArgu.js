const path = require('path');
const fs = require('fs');

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

function checkPageDir(pageDir) {
    let hasMain = false;
    let hasConfig = false;
    const files = fs.readdirSync(pageDir);
    files.forEach(file => {
        if (file === 'main.js') {
            hasMain = true;
        } else if (file === 'config.json') {
            hasConfig = true;
        }
    });
    return hasMain && hasConfig;
}

function scan(dirPath, taskList) {
    const absolutePath = path.resolve(__dirname, '../../', dirPath);
    const relativePath = absolutePath.replace(path.resolve(__dirname, '../../'), '').slice(1);
    
    if (checkPageDir(absolutePath)) {
        taskList.push(relativePath);
    }
    const files = fs.readdirSync(absolutePath);
    files.forEach(file => {
        const fullPath = path.resolve(absolutePath, file);
        const relativePath = fullPath.replace(path.resolve(__dirname, '../../'), '').slice(1);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            scan(relativePath, taskList);
        }
    });
};

function compilerArgu(arvs, mode) {

    // 校验参数正确性
    if (!validateCmdParam(arvs, mode)) {
        process.exit();
    }
    const taskList = [];
    if (arvs[0] === 'all') {
        scan(config.basePath, taskList);
    } else {
        scan(path.resolve(config.basePath, arvs[0]), taskList);
    }

    return taskList;
};

exports.compilerArgu = compilerArgu;
exports.scan = scan;
