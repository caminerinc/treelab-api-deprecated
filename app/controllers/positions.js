const posQueries = require('../queries/positions');

module.exports = {
  changePosition({ originalPositions, targetPosition, parentId, type }) {
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
    return posQueries.query(sql, { replacements: [parentId, type] });
  },

  async create({ siblingId, parentId, type }) {
    const lastPosition = await posQueries.getLast(parentId, type);
    const position = (lastPosition.dataValues.max || 0) + 1;
    return await posQueries.create({ siblingId, position, parentId }, type);
  },

  getByIds(ids) {
    return posQueries.getByIds(ids);
  },

  bulkCreate(records, type) {
    return posQueries.bulkCreate(records, type);
  },

  getLastPosition(parentId, type) {
    return posQueries.getLast(parentId, type);
  },
};
