const tmplQueries = require('../queries/templates');
const tblController = require('../controllers/tables');
const bseController = require('../controllers/bases');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async generate(tmplId, budId) {
    const tmpl = await tmplQueries.getOne(tmplId);
    if (!tmpl) error(Status.Forbidden, ECodes.TMPL_NOT_FOUND);
    let params = { name: tmpl.name };
    if (budId) params.budId = budId;
    const base = await bseController.createBaseOnly(params);
    await tblController.bulkTables(base.id, tmpl.data);
    return base.id;
  },
};
