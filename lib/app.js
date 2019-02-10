const Koa = require('koa');
const Router = require('koa-router');
const respond = require('koa-respond');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const extend = require('extend2');
const path = require('path');
const jwt = require('koa-jwt');
const kcors = require('kcors')();
const minimist = require('minimist');

const router = require('../app/router');
const envConfig = require('../config/config');

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
    const args = minimist(process.argv.slice(2));
    const env = args.env || envConfig.nodeEnv;
    console.log(`currently on environment: ${env}`);

    if (!this.config.port) throw new Error('port is required');
    const port = env === 'test' ? this.config.testPort : this.config.port;
    this.app.listen(port);
    console.log(`app is listening at port ${port}`);
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
    this.app.use(kcors);
    this.app.use(this._errorHandleMiddleware.bind(this));
    this.app.use(respond());
    this.app.use(logger());
    this.app.use(bodyParser());
    this.app.use(
      jwt({
        secret: envConfig.sharedSecret,
        passthrough: envConfig.passThrough === true,
      }).unless({
        path: [/^\/api\/public\/*/],
      }),
    );
  }

  async _errorHandleMiddleware(ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500;
      const code = err.code || 'SYSTEM_ERROR';
      const error =
        status === 500 && envConfig.nodeEnv === 'prod'
          ? 'Internal Server Error'
          : err.message;
      ctx.body = { message: error, code: code, httpStatus: status };
      if (err.details) ctx.body.details = err.details;
      ctx.status = status;
    }
  }
}

module.exports = WebApp;
