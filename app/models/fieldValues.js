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
      as: 'fld',
    });
    fieldValues.belongsTo(models.records, {
      foreignKey: 'recordId',
      as: 'rec',
    });
    fieldValues.hasMany(models.multipleAttachmentValues, {
      foreignKey: 'fieldValueId',
      as: 'multiAttV',
    });
    fieldValues.hasMany(models.foreignKeyValues, {
      foreignKey: 'symmetricFieldValueId',
      as: 'symKV',
    });
    fieldValues.hasMany(models.foreignKeyValues, {
      foreignKey: 'fieldValueId',
      as: 'fgnKV',
    });
  };
  return fieldValues;
};
