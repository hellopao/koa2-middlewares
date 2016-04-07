"use strict";
const request = require("request");
const cheerio = require("cheerio");
const KOA_MIDDLEWARES_PAGE = "https://github.com/koajs/koa/wiki";
const KOA_MIDDLEWARES_DEFINITION = "https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/";
const http = request.defaults({
    headers: {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36"
    }
});
function getKoa2Middlewares() {
    return new Promise((resolve, reject) => {
        http.get(KOA_MIDDLEWARES_PAGE, (err, res, body) => {
            if (err) {
                reject(err);
            }
            else {
                const $ = cheerio.load(body);
                const middlewares = Array.from($('td[align="center"]'))
                    .filter(node => $(node).html() !== "")
                    .map(node => {
                    return $(node).prev().find('a').html();
                });
                resolve(middlewares);
            }
        });
    });
}
exports.getKoa2Middlewares = getKoa2Middlewares;
;
function isMiddlewareNoDefinitions(middleware) {
    return new Promise((resolve, reject) => {
        http.get(`${KOA_MIDDLEWARES_DEFINITION}${middleware}`, (err, res, body) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res.statusCode === 404);
            }
        });
    });
}
exports.isMiddlewareNoDefinitions = isMiddlewareNoDefinitions;
;
function getKoaMiddlewareGithub(middleware) {
    return new Promise((resolve, reject) => {
        http.get(KOA_MIDDLEWARES_PAGE, (err, res, body) => {
            if (err) {
                reject(err);
            }
            else {
                const $ = cheerio.load(body);
                const result = Array.from($('td[align="center"]'))
                    .find(node => {
                    return $(node).prev().find('a').html() === middleware;
                });
                if (result) {
                    resolve($(result).prev().find('a').attr('href'));
                }
                else {
                    resolve();
                }
            }
        });
    });
}
exports.getKoaMiddlewareGithub = getKoaMiddlewareGithub;
//# sourceMappingURL=index.js.map