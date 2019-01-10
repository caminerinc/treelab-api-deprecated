module.exports = (sequelize, DataTypes) => {
  const positions = sequelize.define(
    'positions',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      parentId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      position: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return positions;
};
