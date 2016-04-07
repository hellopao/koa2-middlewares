#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const open = require('open');
const program = require("commander");
const middlewares = require("../");
const pkg = require('../package');
program
    .version(pkg.version)
    .usage('[command]');
program
    .command('list')
    .description('列出未定义.d.ts的koa2中间件')
    .action(() => __awaiter(this, void 0, void 0, function* () {
    process.stdout.write('正在获取没有.d.ts的koa2中间件,请稍等...\n');
    try {
        const total = yield middlewares.getKoa2Middlewares();
        const results = yield Promise.all(total.map(middleware => middlewares.isMiddlewareNoDefinitions(middleware)));
        const list = total.filter((middleware, index) => results[index]);
        process.stdout.write('下列koa2中间件没有.d.ts:\n');
        process.stderr.write(list.join('\n'));
    }
    catch (err) {
        process.stdout.write('获取中间件列表失败: %s', err);
    }
}));
program
    .command('open <middleware>')
    .description('列出未定义.d.ts的koa2中间件')
    .action((middleware) => __awaiter(this, void 0, void 0, function* () {
    process.stdout.write('正在获取该中间件github地址,请稍等...\n');
    const result = yield middlewares.getKoaMiddlewareGithub(middleware);
    if (result) {
        open(result);
    }
    else {
        process.stdout.write('未找到该中间件的github地址');
    }
}));
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=koa.js.map