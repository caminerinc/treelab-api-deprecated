const posController = require('../controllers/positions');
const records = require('../queries/records');

const create = async tableId => {
  const result = await records.create({ tableId });
  const position = await posController.create({
    parentId: tableId,
    id: result.id,
    type: 'record',
  });
  result.position = position.position;
  return result;
};

module.exports = {
  create,
  async checkTableAndCreate(tableId) {
    // TODO: @Moya Really not sure why this isn't working, I have to import it here
    const tblCtrl = require('../controllers/tables');
    await tblCtrl.checkIfExists(tableId);
    return create(tableId);
  },

  async deleteMultiple(rows) {
    await records.destroy(rows);
    const result = await posController.getByIds(rows);
    if (result.length) {
      await posController.deletePositions({
        deletePositions: Array.from(result, i => i.position),
        parentId: result[0].parentId,
        type: 'record',
      });
    }
    return null;
  },
};
