module.exports = (sequelize, DataTypes) => {
  const fieldTypes = sequelize.define(
    'fieldTypes',
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
  return fieldTypes;
};
