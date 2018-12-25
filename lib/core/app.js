const Koa = require('koa');
const Router = require('koa-router');
const respond = require('koa-respond');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const extend = require('extend2');
const path = require('path');
const jwt = require('koa-jwt');
require('dotenv').config();

const router = require('../../app/router');

class WebApp {
  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.config = {};
    this.env = this.app.env;
    this.baseDir = process.cwd();
    this.app.on('error', err => {
      console.error('server error', err);
    });
  }

  run() {
    this.loadConfig();
    this.loadMiddleware();
    this.loadRoute();
    if (!this.config.port) throw new Error('port is required');
    this.app.listen(this.config.port);
    console.log(`listen: ${this.config.port}`);
  }

  loadConfig() {
    let currentConfig = {};
    try {
      currentConfig = require(path.join(this.baseDir, 'config', 'config'));
    } catch (e) {
      console.log(e);
    }
    this.config = extend(true, {}, currentConfig);
    this.app.config = this.config;
  }

  loadRoute() {
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  loadMiddleware() {
    this.app.use(this._errorHandleMiddleware.bind(this));
    this.app.use(respond());
    this.app.use(logger());
    this.app.use(bodyParser());
    // this.app.use(
    //   jwt({ secret: process.env.SHARED_SECRET }).unless({
    //     path: [/^\/api\/public\/*/],
    //   }),
    // );
  }

  async _errorHandleMiddleware(ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      const error =
        status === 500 && ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;

      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  }
}

module.exports = WebApp;
