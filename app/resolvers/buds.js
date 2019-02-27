const rp = require('request-promise');
const budsController = require('../controllers/buds');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const { url } = require('../../config/config');

const BUDS_MAPPING = {
  'data-extraction': url.attachmentExtraction,
};

module.exports = {
  async executeBud(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'action', 'data');
    if (!BUDS_MAPPING[params.action])
      error(Status.Forbidden, ECodes.BUD_NOT_FOUND, params.action);
    if (typeof params.data === 'string') {
      try {
        params.data = JSON.parse(params.data);
      } catch (e) {
        error(Status.Forbidden, ECodes.INVALID_JSON);
      }
    }
    try {
      await rp({
        uri: BUDS_MAPPING[params.action],
        method: 'POST',
        form: params.data,
        json: true,
      });
      ctx.body = { message: 'success' };
    } catch (e) {
      error(Status.Forbidden, ECodes.BUDS_SERVER_ERROR);
    }
  },

  async createBud(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'appId');
    const result = await sequelize.transaction(() =>
      budsController.generate(params.appId),
    );
    ctx.body = result;
  },

  async getOneBud(ctx) {
    const budId = ctx.params.budId;
    checkKeyExists(ctx.params, 'budId');
    const bud = await budsController.getOne(budId);
    ctx.body = bud;
  },
};
