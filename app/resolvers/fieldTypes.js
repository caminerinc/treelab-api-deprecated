const { getFieldTypes } = require('../util/fieldTypes');

module.exports = {
  async getAll(ctx) {
    ctx.body = (await getFieldTypes()).names;
  },
};
