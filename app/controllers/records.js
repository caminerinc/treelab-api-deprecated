const posController = require('../controllers/positions');
const { POSITION_TYPE } = require('../constants/app');
const recQueries = require('../queries/records');

const create = async tableId => {
  const result = await recQueries.create({ tableId });
  const position = await posController.create({
    parentId: tableId,
    siblingId: result.id,
    type: POSITION_TYPE.RECORD,
  });

  result.position = position.position;
  return result;
};

module.exports = {
  create,
  async checkTableAndCreate(tableId) {
    // TODO: Require is not working properly
    const tblCtrl = require('../controllers/tables');
    await tblCtrl.checkIfExists(tableId);
    return create(tableId);
  },

  deleteMultiple(rows) {
    return recQueries.destroy(rows);
  },
};
