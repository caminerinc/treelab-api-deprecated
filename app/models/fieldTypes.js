module.exports = (sequelize, DataTypes) => {
  const FieldTypes = sequelize.define('FieldTypes', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isPrimitive: {
      type: DataTypes.BOOLEAN,
    },
    isArray: {
      type: DataTypes.BOOLEAN,
    },
  });
  return FieldTypes;
};
