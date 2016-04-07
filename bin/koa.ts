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
	.description('list koa2 middlewares')
	.option('-i, --ignore', 'filter definited middlewares')
	.action(async (options) => {
        process.stdout.write('fetching koa2 middlewares\n');
        
        try {
            var list = await middlewares.getKoa2Middlewares();  

            if (options.ignore) {
                const results = await Promise.all(list.map(middleware => middlewares.isMiddlewareNoDefinitions(middleware)));
                list = list.filter((middleware,index) => results[index]);
            }
            
            process.stdout.write('result:\n');
            process.stderr.write(list.join('\n'));
        } catch (err) {
            process.stdout.write('fetching failed: %s', err)
        }
	})	
	
/**
 * 访问所选koa2中间件的github主页
 */
program
	.command('open <middleware>')
	.description(`open koa2 middleware's github`)
	.action(async (middleware) => {
        process.stdout.write('fetching github url\n');
		const result = await middlewares.getKoaMiddlewareGithub(middleware);  
        if (result) {
            open(result);
        } else {
            process.stdout.write('github not found');
        }
	})
    
program.parse(process.argv);

// display help by default
if (!process.argv.slice(2).length) {
    program.outputHelp();
}