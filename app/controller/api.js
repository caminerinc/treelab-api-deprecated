'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {
  async healthCheck() {
    this.ctx.body = 'Connection established';
  }
}

module.exports = ApiController;
