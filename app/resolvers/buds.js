const rp = require('request-promise');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

const BUDS_MAPPPING = {
  'data-extraction': 'http://52.81.16.146:8082/extract_service',
};

module.exports = {
  async executeBud(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'action', 'data');
    if (!BUDS_MAPPPING[params.action])
      error(Status.Forbidden, ECodes.BUD_NOT_FOUND, params.action);
    try {
      const result = await rp({
        uri: BUDS_MAPPPING[params.action],
        method: 'POST',
        form: { data: params.data },
        json: true,
      });
      ctx.body = result;
    } catch (e) {
      error(Status.InternalServerError, ECodes.BUDS_SERVER_ERROR);
    }
  },
};
