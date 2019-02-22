const tmplQueries = require('../queries/templates');
const tblcontroller = require('../controllers/tables');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async generate(tmplId) {
    const tmpl = await tmplQueries.getOne(tmplId);
    if (!tmpl) error(Status.Forbidden, ECodes.TMPL_NOT_FOUND);
    tblcontroller;
  },
};
