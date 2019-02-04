const posController = require('../controllers/positions');
const records = require('../queries/records');
const positions = require('../queries/positions');

module.exports = {
  async create(tableId) {
    const result = await records.create({ tableId });
    const position = await posController.create({
      parentId: tableId,
      id: result.id,
      type: 'record',
    });
    result.position = position.position;
    return result;
  },

  // async deleteRecord(rows) {
  //   await records.destroy(rows);
  //   const result = await positions.getPositionsByIds(rows);
  //   if (result.length) {
  //     await deletePositions({
  //       deletePositions: Array.from(result, i => i.position),
  //       parentId: result[0].parentId,
  //       type: 'record',
  //     });
  //   }
  //   return null;
  // },
};
