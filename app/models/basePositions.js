module.exports = (sequelize, DataTypes) => {
  const BasePositions = sequelize.define(
    'BasePositions',
    {
      parentId: DataTypes.UUID,
      position: DataTypes.INTEGER,
      siblingId: DataTypes.UUID,
    },
    {
      timestamps: false,
    },
  );

  return BasePositions;
};
