const { checkKeyExists } = require('../util/helper');
const { getPouches, getPouch } = require('../controllers/pouches');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async resolveGetPouches(ctx) {
    const pouches = await getPouches();
    ctx.body = { pouches: pouches };
  },

  async resolveGetPouch(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'pouchId');
    const pouch = await getPouch(params.pouchId);
    ctx.body = pouch;
  },
};
