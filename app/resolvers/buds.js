const rp = require('request-promise');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

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

    try {
      const result = await rp({
        uri: BUDS_MAPPING[params.action],
        method: 'POST',
        form: { data: params.data },
        json: true,
      });
      ctx.body = result;
    } catch (e) {
      console.log('Buds errors - ', e);
      error(Status.InternalServerError, ECodes.BUDS_SERVER_ERROR);
    }
  },
};
