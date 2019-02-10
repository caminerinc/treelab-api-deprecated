module.exports = (sequelize, DataTypes) => {
  const TablePositions = sequelize.define(
    'TablePositions',
    {
      parentId: DataTypes.UUID,
      position: DataTypes.INTEGER,
      siblingId: DataTypes.UUID,
    },
    {
      timestamps: false,
    },
  );

  return TablePositions;
};
