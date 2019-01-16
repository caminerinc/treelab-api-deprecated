const { records, sequelize } = require('../models');
const {
  createPosition,
  deletePositions,
  getPositionsByIds,
} = require('../controllers/positions');

module.exports = {
  async createRecord(params) {
    async function transactionSteps(t) {
      const result = await records.create(params, { transaction: t });
      await createPosition(
        {
          parentId: params.tableId,
          id: result.id,
          type: 'record',
        },
        { transaction: t },
      );
      return result;
    }
    return await sequelize.transaction(transactionSteps);
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
