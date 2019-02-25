module.exports = (sequelize, DataTypes) => {
  const Buds = sequelize.define('Buds', {
    id: {
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    appId: {
      type: DataTypes.INTEGER,
    },
    actionId: {
      type: DataTypes.INTEGER,
    },
    properties: {
      type: DataTypes.JSONB,
    },
  });
  return Buds;
};
