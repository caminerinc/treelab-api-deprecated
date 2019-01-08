const { sequelize } = require('../models');

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
    sql += ` else position end where "parentId" = '${parentId}'`;
    return await sequelize.query(sql);
  },
};
