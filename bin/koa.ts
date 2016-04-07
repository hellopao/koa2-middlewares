#!/usr/bin/env node
"use strict";

const open = require('open');
import * as program from "commander";

import * as middlewares from "../";

const pkg = require('../package');

program
	.version(pkg.version)
	.usage('[command]')

/**
 * 列出koa2中间件
 */
program
	.command('list')
	.description('列出未定义.d.ts的koa2中间件')
	.action(async () => {
        process.stdout.write('正在获取没有.d.ts的koa2中间件,请稍等...\n');
        
        try {
            const total = await middlewares.getKoa2Middlewares();  

            const results = await Promise.all(total.map(middleware => middlewares.isMiddlewareNoDefinitions(middleware)));
            const list = total.filter((middleware,index) => results[index]);
            
            process.stdout.write('下列koa2中间件没有.d.ts:\n');
            process.stderr.write(list.join('\n'));
        } catch (err) {
            process.stdout.write('获取中间件列表失败: %s', err)
        }
	})	
	
/**
 * 访问所选koa2中间件的github主页
 */
program
	.command('open <middleware>')
	.description('列出未定义.d.ts的koa2中间件')
	.action(async (middleware) => {
        process.stdout.write('正在获取该中间件github地址,请稍等...\n');
		const result = await middlewares.getKoaMiddlewareGithub(middleware);  
        if (result) {
            open(result);
        } else {
            process.stdout.write('未找到该中间件的github地址');
        }
	})
    
program.parse(process.argv);

// display help by default
if (!process.argv.slice(2).length) {
    program.outputHelp();
}