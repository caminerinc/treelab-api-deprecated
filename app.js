'use strict';

const Koa = require('koa');
const Router = require('koa-router');
let app = new Koa();
let router = new Router();
router.get('/api/health-check', ctx => {ctx.body = 'Connection established'});
app.use(router.routes()).use(router.allowedMethods());
app.listen(9000);