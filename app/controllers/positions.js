const { sequelize } = require('../models');
const { positions } = require('../models');

module.exports = {
  async changePosition({ originalPositions, targetPosition, parentId }) {
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
    sql += ` else position end where "parentId" = ?`;
    return await sequelize.query(sql, { replacements: [parentId] });
  },

  async createPosition({ parentId, id }) {
    const prefix = id.slice(0, 3);
    parentId = prefix + '_' + parentId;
    const lastPosition = await positions.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('position')), 'max']],
      where: { parentId },
    });
    const position = (lastPosition.dataValues.max || 0) + 1;
    return await positions.create({
      id: id,
      position,
      parentId,
    });
  },
};
