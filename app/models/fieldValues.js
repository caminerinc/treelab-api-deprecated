module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'ukRecordIdFieldId',
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'ukRecordIdFieldId',
      },
      textValue: DataTypes.STRING,
    },
    {},
  );
  return fieldValues;
};
