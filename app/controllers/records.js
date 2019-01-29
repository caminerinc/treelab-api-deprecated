const { createPosition } = require('../controllers/positions');
const records = require('../queries/records');

module.exports = {
  async createRecord(tableId) {
    const result = await records.create({ tableId });
    await createPosition({
      parentId: tableId,
      id: result.id,
      type: 'record',
    });
    return result;
  },

  async deleteRecord({ rows }) {
    async function transactionSteps(t) {
      await records.destroy({
        where: {
          id: {
            $in: rows,
          },
        },
        transaction: t,
      });
      const result = await getPositionsByIds(rows);
      if (result.length) {
        await deletePositions(
          {
            deletePositions: Array.from(result, i => i.position),
            parentId: result[0].parentId,
            type: 'record',
          },
          t,
        );
      }
    }
    return await sequelize.transaction(transactionSteps);
  },
};
