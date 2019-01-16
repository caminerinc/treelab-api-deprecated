const { sequelize } = require('../models');
const { positions } = require('../models');

module.exports = {
  async changePosition({ originalPositions, targetPosition, parentId, type }) {
    targetPosition = parseInt(targetPosition);
    originalPositions = Array.from(originalPositions, i => parseInt(i));
    originalPositions.sort();
    const originLen = originalPositions.length;
    const minPosition = Math.min(originalPositions[0], targetPosition);
    const maxPosition = Math.max(
      originalPositions[originLen - 1],
      targetPosition,
    );
    const temp = originalPositions.reduce((sum, originalPosition) => {
      if (originalPosition < targetPosition) sum++;
      return sum;
    }, 0);
    let movedNum = 0;
    let sql = `update positions set position = case`;
    for (let i = minPosition; i <= maxPosition; i++) {
      if (originalPositions.indexOf(i) === -1) {
        if (i >= targetPosition) {
          sql += ` when position = ${i} then ${i + originLen - movedNum}`;
        } else {
          sql += ` when position = ${i} then ${i - movedNum}`;
        }
      } else {
        sql += ` when position = ${i} then ${targetPosition - temp + movedNum}`;
        movedNum++;
      }
    }
    sql += ` else position end where "parentId" = ? and "type" = ?`;
    return await sequelize.query(sql, { replacements: [parentId, type] });
  },

  async createPosition({ parentId, id, type }, transact) {
    const lastPosition = await positions.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('position')), 'max']],
      where: { parentId, type },
    });
    const position = (lastPosition.dataValues.max || 0) + 1;
    return await positions.create({ id, position, parentId, type }, transact);
  },

  async getPositions(parentId, type) {
    return await positions.findAll({
      attributes: ['id', 'position'],
      where: { parentId, type },
      order: [['position', 'asc']],
    });
  },

  async getPositionsByIds(ids) {
    return await positions.findAll({
      where: { id: { $in: ids } },
    });
  },

  async deletePositions({ deletePositions, parentId, type }, transaction) {
    deletePositions = Array.from(deletePositions, i => parseInt(i));
    deletePositions.sort();
    const len = deletePositions.length;
    let movedNum = 0;
    let sql = `update positions set position = case`;
    for (let i = deletePositions[0]; i < deletePositions[len - 1]; i++) {
      if (deletePositions.indexOf(i) === -1) {
        sql += ` when position = ${i} then ${i - movedNum}`;
      } else {
        movedNum++;
      }
    }
    sql += ` when position > ${
      deletePositions[len - 1]
    } then position - ${len} else position end where "parentId" = ? and "type" = ?`;
    await positions.destroy({
      where: {
        position: { $in: deletePositions },
        parentId,
        type,
      },
      transaction,
    });
    await sequelize.query(sql, { replacements: [parentId, type], transaction });
  },
  async deleteParentId(parentId) {
    return await positions.destroy({
      where: { parentId: { $in: parentId } },
    });
  },
};
