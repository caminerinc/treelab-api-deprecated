module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'uk_recordId_fieldId',
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'uk_recordId_fieldId',
      },
      textValue: DataTypes.STRING,
    },
    {},
  );
  return fieldValues;
};
