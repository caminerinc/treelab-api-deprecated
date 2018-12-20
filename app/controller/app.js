'use strict';

const Controller = require('egg').Controller;

class AppController extends Controller {
  async healthCheck() {
    this.ctx.body = 'Connection established';
  }
}

module.exports = AppController;
