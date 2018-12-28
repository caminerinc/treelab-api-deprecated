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
