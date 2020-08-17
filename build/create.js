const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const config = require('../config/template');
const {basePath} = require('../config/');
const tempPath = path.join(__dirname, '../config/template/');

const newFile = ['main.js', 'app.vue', 'App.vue', 'config.json'];
const defaultLibs = {
    mpa: ['fastclick', 'vue', 'axios'],
    spa: ['fastclick', 'vue', 'axios', 'vue-router']
}

const catDir = async dirPath => {
    const exists = await fs.pathExists(dirPath);
    if (exists) {
        return fs.readdirSync(dirPath).filter(d => fs.lstatSync(path.join(dirPath, d)).isDirectory());
    } else return [];
};
const catFile = async filePath => {
    const exists = await fs.pathExists(filePath);
    if (exists) {
        return fs.readdirSync(filePath).filter(d => {
            return fs.lstatSync(path.join(filePath, d)).isFile();
        });
    } else return [];
};

class ANP {
    constructor(pagePath, pmode, title) {
        this.basePath = path.join(__dirname, '../', basePath);
        this.libs = [];
        this.verifyArg(pagePath, pmode, title);
    }
    verifyArg(pagePath, pmode, title) {
        if (pagePath && /[^/a-zA-Z0-9]/g.test(pagePath)) return this.errorMsg = 'pagePath参数错误：只能为字母和数字';
        const [mode, spaMode] = pmode ? pmode.split(':').map(r => r.toLowerCase()) : [];
        if (mode && mode !== 'spa' && mode !== 'mpa') return this.errorMsg = 'pageMode参数错误：只支持spa或mpa';
        if (spaMode && spaMode !== 'hash' && spaMode !== 'history') return this.errorMsg = 'spaMode参数错误：只支持hash或history';
        this.pagePath = pagePath ? `/${pagePath}` : '';
        this.name = this.pagePath && this.pagePath.split('/').pop();
        this.mode = mode;
        this.spaMode = spaMode;
        this.title = title;
    }
    start() {
        if (this.errorMsg) return console.error(this.errorMsg);
        if (this.pagePath && this.mode) {
            // 参数齐，直接创建
            // 参数补充
            this.spaMode = this.mode === 'spa' ? (this.spaMode || 'hash') : '';
            this.title = this.title || this.name;
            this.libs = this.libs.length ? this.libs : defaultLibs[this.mode];
            this.create();
        } else {
            // 问询
            this.gather();
        }
    }
    async gather() {
        // 获取到文件夹
        await this.locDir();
        // 查重
        const oldFile = await catFile(path.join(this.basePath, this.pagePath));
        const repetFile = [];
        newFile.forEach(n => {
            oldFile.indexOf(n) > -1 && (repetFile.push(n));
        });
        if (repetFile.length) {
            const { type } = await this.ask({
                type: 'confirm',
                name: 'type',
                message: `当前目录下已存在：${repetFile.toString()}，继续覆盖?`
            });
            if (!type) {
                console.log('已取消');
                return process.exit();
            }
        }
        // 页面配置
        await this.pageConfigSet();
        // name
        this.name = this.pagePath.split('/').pop();
        this.start();
    }
    async pageConfigSet() {
        let res;
        // 标题
        res = await this.ask({
            type: 'input',
            name: 'title',
            message: '设置页面title',
            default: 'demo'
        });
        this.title = res.title;
        // 页面模式
        res = await this.ask({
            type: 'list',
            name: 'pageMode',
            message: '页面模式',
            default: 0,
            choices: [
                {
                    name: '多页模式',
                    value: 'mpa',
                    checked: true
                },
                {
                    name: '单页模式',
                    value: 'spa'
                }
            ]
        });
        this.mode = res.pageMode;
        // spa模式
        if (this.mode === 'spa') {
            res = await this.ask({
                type: 'list',
                name: 'spaMode',
                message: 'spa模式',
                default: 0,
                choices: [
                    {
                        name: 'hash',
                        value: 'hash',
                        checked: true
                    },
                    {
                        name: 'history',
                        value: 'history'
                    }
                ]
            });
            this.spaMode = res.spaMode;
        }
        // libs
        // 根据mode设置默认项
        const choices = [];
        for (const a in config.libs) {
            choices.push({
                name: a,
                value: a,
                checked: !!~defaultLibs[this.mode].indexOf(a)
            });
        }
        res = await this.ask({
            type: 'checkbox',
            name: 'libs',
            message: '选择页面依赖项',
            choices
        });
        this.libs = res.libs;
    }
    async locDir() {
        let res;
        const choices = [{ name: '新建文件夹', value: 'create' }];
        let dirSelect = await catDir(path.join(this.basePath, this.pagePath));
        dirSelect = dirSelect.map(d => {
            return {
                name: d,
                value: d
            };
        })
        if (dirSelect.length) choices.push({ name: '选择文件夹', value: 'choose' });
        if (this.pagePath) choices.push({ name: '就在此地', value: 'build' });
        res = await this.ask({
            type: 'list',
            name: 'type',
            message: `在哪创建页面？当前目录：/${basePath}${this.pagePath}`,
            choices
        })
        if (res.type === 'build') {
            return;
        }
        if (res.type === 'create') {
            const {dirName} = await this.ask({
                type: 'input',
                name: 'dirName',
                message: '请输入文件夹名'
            })
            this.pagePath += `/${dirName}`;
            return await this.locDir();
        }
        if (res.type === 'choose') {
            const { dirName } = await inquirer.prompt({
                type: 'list',
                name: 'dirName',
                message: `在哪创建页面？当前目录：/${basePath}${this.pagePath}`,
                choices: dirSelect
            })
            this.pagePath += `/${dirName}`;
            return await this.locDir();
        }
    }
    ask(params, key) {
        return inquirer.prompt(Object.assign({
            name: key,
        }, params));
    }
    async create() {
        await this.createDir();
        this.createMain();
        this.createAPP();
        this.createConfig();
        await this.createAsset();
        if (this.mode === 'spa') await this.createRoute();
        console.log('创建完成！');
    }
    async createDir(c = '') {
        try {
            await fs.ensureDir(path.join(this.basePath, this.pagePath, c));
        } catch(e) {
            console.err(e)
            process.exit();
        }
    }
    async createFile(c, f) {
        try {
            await fs.outputFile(path.join(this.basePath, this.pagePath, c), f);
        } catch(e) {
            console.err(e)
            process.exit();
        }
    }
    createMain() {
        // 创建main.js 添加注释
        let tempJs = fs.readFileSync(path.join(tempPath, 'main.js'), 'utf8');
        tempJs = tempJs.replace('{{version}}', `
/** from cmd ${config.version}
* devServer命令：npm run dev ${this.pagePath}
* 本地地址：http://localhost:8000/${this.pagePath}
*/
`);
        let [imortSupplement, vueSupplement] = ['', ''];
        if (this.mode === 'spa') {
            imortSupplement = `import router from './router'`;
            vueSupplement = `\n    router,`
        }
    
        tempJs = tempJs.replace('{{import-supplement}}', imortSupplement);
        tempJs = tempJs.replace('{{vue-supplement}}', vueSupplement);
        fs.writeFileSync(path.join(this.basePath, this.pagePath, 'main.js'), tempJs, { encoding: 'utf8' });
    }
    createAPP() {
        // 创建App.vue 替换文件夹名称为name和class
        let tempVue = fs.readFileSync(path.join(tempPath, 'App.vue'), 'utf8');
        tempVue = tempVue.replace(/\{\{main\}\}/g, this.name);
        tempVue = tempVue.replace('<<title>>', `'${this.title}'`);
        tempVue = tempVue.replace(/\{\{template\-content\}\}/g, this.mode === 'mpa' ? `<div class="m-${this.name}">{{title}}</div>` : `<transition>
        <router-view></router-view>
    </transition>`);
        fs.writeFileSync(path.join(this.basePath, this.pagePath, 'App.vue'), tempVue, { encoding: 'utf8' });
    }
    createConfig() {
            // 创建config.json
            const temPpageConfig = `
{
    "mode": "${this.mode}",
    "spaMode": "${this.spaMode || ''}",
    "title": "${this.title}",
    "libs": ["${this.libs.join('", "')}"]
}`
        fs.writeFileSync(path.join(this.basePath, this.pagePath, 'config.json'), temPpageConfig, { encoding: 'utf8' });
    }
    async createRoute() {
        let tempRouter = fs.readFileSync(path.join(tempPath, 'route.js'), 'utf8');
        tempRouter = tempRouter.replace('{{page-spa-mode}}', `${this.spaMode}`);
        tempRouter = tempRouter.replace('{{page-spa-base}}', `${this.pagePath}/`);
        await this.createFile('/router/index.js', tempRouter, { encoding: 'utf8' });
    
        let homeVue = fs.readFileSync(path.join(tempPath, 'App.vue'), 'utf8');
        homeVue = homeVue.replace(/\{\{main\}\}/g, 'home');
        homeVue = homeVue.replace(/\{\{template\-content\}\}/g, '<div class="m-home">{{title}}</div>');
        homeVue = homeVue.replace('<<title>>', `'${this.title}-home'`);
        await this.createFile('/views/home.vue', homeVue, { encoding: 'utf8' });
    }
    async createAsset() {
        await this.createDir('assets');
        await this.createDir('common');
        await this.createDir('components');
    }
    
}

const anp = new ANP(...process.argv.slice(2));
anp.start();
