module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'fieldValues_recordId_fieldId_uk',
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'fieldValues_recordId_fieldId_uk',
      },
      textValue: DataTypes.STRING,
      numberValue: DataTypes.INTEGER,
    },
    {},
  );
  fieldValues.associate = function(models) {
    fieldValues.belongsTo(models.fields, {
      foreignKey: 'fieldId',
      as: 'field',
    });
    fieldValues.belongsTo(models.records, {
      foreignKey: 'recordId',
      as: 'record',
    });
    fieldValues.hasMany(models.multipleAttachmentValues, {
      foreignKey: 'fieldValueId',
      as: 'multipleAttachmentValues',
    });
    fieldValues.hasMany(models.foreignKeyValues, {
      foreignKey: 'symmetricFieldValueId',
      as: 'symmetricKeyValue',
    });
    fieldValues.hasMany(models.foreignKeyValues, {
      foreignKey: 'fieldValueId',
      as: 'foreignKeyValue',
    });
  };
  return fieldValues;
};
