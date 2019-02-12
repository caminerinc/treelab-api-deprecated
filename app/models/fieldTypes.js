module.exports = (sequelize, DataTypes) => {
  const FieldTypes = sequelize.define(
    'FieldTypes',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return FieldTypes;
};
