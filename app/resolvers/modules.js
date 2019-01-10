const rp = require('request-promise');
const { getModules } = require('../controllers/modules');
const { checkKeyExists } = require('../util/helper');
const config = require('../../config/config');

module.exports = {
  async resolveGetModules(ctx) {
    const modules = await getModules();
    ctx.body = { modules: modules };
  },

  async resolveExtraction(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'url', 'type');
    const result = await rp({
      uri: config.url.attachmentExtraction,
      method: 'POST',
      form: params,
      json: true,
    });
    ctx.body = result;
  },
};
