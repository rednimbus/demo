
const path = require('path');
const cp = require('child_process');
const os = require('os');
const utils = require('./util');
const config = require('../config');
class Build {
    /**
     * @param {*} arvs 命令行参数
     */
    constructor(arvs) {

        // 命令参数
        this.arvs = arvs;

        // 命令行参数是否验证通过
        this.isValidation = true;

        // 需要执行webpack命令的任务列表
        this.taskList = [];

        // 是否全部编译
        this.isAll = false;

        // 子进程数量,默认是cpu内核数量
        this.workerCount = os.cpus().length;

        // 记录已经执行完成的进程数量
        this.completeWorkerCount = 0;
        
        this.init();
    }

    init() {
        if (!utils.validateCmdParam(this.arvs, 'build')) {
            this.isValidation = false;
            return;
        }
        this.convertArvsToLowcase();
        this.resolveCmdParam();
        if (this.isAll) {
            utils.scan(config.basePath, this.taskList);
        } else {
            utils.scan(path.resolve(config.basePath, this.arvs[0]), this.taskList);
        }

        console.log(`本次要执行的任务列表：${this.taskList}`);
    }

    /**
     * 将数组里面的参数部分转换为小写
     */
    convertArvsToLowcase() {
        this.arvs.map((currentValue, index) => {
            if (index !== 0 && !currentValue.includes('--')) { return currentValue.toLowerCase(); }
            return currentValue;
        }, this.arvs);
    }

    /**
     * 解析命令行参数，设置isAll
     */
    resolveCmdParam() {
        if (this.arvs[0] === 'all') {
            this.isAll = true;
        }
    }

    run() {
        if (!this.isValidation) return;
        let count = this.workerCount;
        let i = 0;
        while(this.taskList.length) {
            this.startWorker(this.taskList.splice(0, Math.ceil(this.taskList.length / count--)), i++);
        }
    }

    /**
     * 开启子进程
     * @param {Array} tasks 任务列表
     * @param {Number} index 进程编号
     */
    startWorker(tasks, index) {
        const runnerConfig = {
            taskList: tasks,
            workerId: index
        };
        const worker = cp.fork(`${__dirname}/webpack.task.js`);
        worker.send(runnerConfig);
        worker.on('message', data => {
            if (data.code !== 1) {
                // 子进程异常，主进程退出
                process.exit(0);
            }
        });
    }
}

/**
 * 初始化函数
 */
const init = function () {
    const arvs = process.argv.slice(2); // ['invoice']
    new Build(arvs).run();
};

init();
