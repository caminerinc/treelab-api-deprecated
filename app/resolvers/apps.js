const { pick } = require('lodash');
const appsController = require('../controllers/apps');

module.exports = {
  async getAll(ctx) {
    const result = await appsController.getAll();
    ctx.body = result.map(i => pick(i, ['id', 'name', 'description']));
  },
};
