const tmplController = require('../controllers/templates');
const { checkKeyExists } = require('../util/helper');
const { sequelize } = require('../models/index');

module.exports = {
  async generate(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'templateId');
    await sequelize.transaction(() =>
      tmplController.generate(params.templateId),
    );
    ctx.body = { message: 'success' };
  },
};
