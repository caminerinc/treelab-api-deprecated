const { pick } = require('lodash');
const appsController = require('../controllers/apps');

module.exports = {
  async getAll(ctx) {
    ctx.body = await appsController.getAll();
  },
};
