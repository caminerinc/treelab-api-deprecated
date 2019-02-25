const budsQueries = require('../queries/buds');
const tmplController = require('../controllers/templates');
const appController = require('../controllers/apps');
const { error, Status, ECodes } = require('../util/error');

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
    const baseId = await tmplController.generate(app.templateId, bud.id);
    return { budId: bud.id, baseId };
  },

  async getOne(budId) {
    const bud = await budsQueries.getOne(budId);
    if (!bud) error(null, ECodes.BUD_NOT_FOUND);
    return bud;
  },
};
