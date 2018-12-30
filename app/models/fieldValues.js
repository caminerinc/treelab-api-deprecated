module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      textValue: DataTypes.STRING,
    },
    {},
  );
  return fieldValues;
};
