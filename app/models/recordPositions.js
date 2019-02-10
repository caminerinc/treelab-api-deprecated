module.exports = (sequelize, DataTypes) => {
  const RecordPositions = sequelize.define(
    'RecordPositions',
    {
      parentId: DataTypes.UUID,
      position: DataTypes.INTEGER,
      siblingId: DataTypes.UUID,
    },
    {
      timestamps: false,
    },
  );

  return RecordPositions;
};
