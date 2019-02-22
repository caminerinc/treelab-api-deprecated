const tmplQueries = require('../queries/templates');
const tblController = require('../controllers/tables');
const bseController = require('../controllers/bases');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async generate(tmplId) {
    const tmpl = await tmplQueries.getOne(tmplId);
    if (!tmpl) error(Status.Forbidden, ECodes.TMPL_NOT_FOUND);
    const base = await bseController.createBaseOnly(tmpl.name);
    await tblController.bulkTables(base.id, tmpl.data);
  },
};
