const Koa = require('koa');
const Router = require('koa-router');
const extend = require('extend2');
const path = require('path');

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
    this.loadMiddleware;
    this.loadRoute();
    if (!this.config.port) throw new Error('port is necessary');
    this.app.listen(this.config.port);
  }

  loadConfig() {
    let currentConfig = {};
    try {
      currentConfig = require(path.join(
        this.baseDir,
        'config',
        `config.${this.env}`,
      ));
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
    this.app.use(this._errorHandleMiddleware);
  }

  async _errorHandleMiddleware() {
    try {
      await next();
    } catch (err) {
      this.ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      const error =
        status === 500 && this.ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;

      this.ctx.body = { error };
      if (status === 422) {
        this.ctx.body.detail = err.errors;
      }
      this.ctx.status = status;
    }
  }
}

module.exports = WebApp;
