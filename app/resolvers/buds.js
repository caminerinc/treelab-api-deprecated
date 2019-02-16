const rp = require('request-promise');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

const BUDS_MAPPPING = {
  'data-extraction': 'http://52.80.52.148:5000/buds/data-extraction',
};

module.exports = {
  async executeBud(params) {
    checkKeyExists(params, 'action', 'data');
    if (!BUDS_MAPPPING[params.action])
      error(Status.Forbidden, ECodes.BUD_NOT_FOUND, params.action);
    const result = await rp({
      uri: BUDS_MAPPPING[params.action],
      method: 'POST',
      form: params.data,
      json: true,
    });
    ctx.body = result;
  },
};
