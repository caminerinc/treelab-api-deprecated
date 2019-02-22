const budsQueries = require('../queries/buds');
const tmplController = require('../controllers/templates');
const appController = require('../controllers/apps');

module.exports = {
  create(params) {
    return budsQueries.create(params);
  },

  async generate(appId) {
    const app = await appController.getOne(appId);
    if (!app) error(null, ECodes.APP_NOT_FOUND);
    const bud = await budsQueries.create({
      appId,
      properties: app.properties,
    });
    await tmplController.generate(app.templateId, bud.id);
  },
};
