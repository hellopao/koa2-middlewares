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
    .description('list koa2 middlewares')
    .option('-i, --ignore', 'filter definited middlewares')
    .action((options) => __awaiter(this, void 0, void 0, function* () {
    process.stdout.write('fetching koa2 middlewares\n');
    try {
        var list = yield middlewares.getKoa2Middlewares();
        if (options.ignore) {
            const results = yield Promise.all(list.map(middleware => middlewares.isMiddlewareNoDefinitions(middleware)));
            list = list.filter((middleware, index) => results[index]);
        }
        process.stdout.write('result:\n');
        process.stderr.write(list.join('\n'));
    }
    catch (err) {
        process.stdout.write('fetching failed: %s', err);
    }
}));
program
    .command('open <middleware>')
    .description(`open koa2 middleware's github`)
    .action((middleware) => __awaiter(this, void 0, void 0, function* () {
    process.stdout.write('fetching github url\n');
    const result = yield middlewares.getKoaMiddlewareGithub(middleware);
    if (result) {
        open(result);
    }
    else {
        process.stdout.write('github not found');
    }
}));
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=koa.js.map