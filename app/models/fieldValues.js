module.exports = (sequelize, DataTypes) => {
  const FieldValues = sequelize.define(
    'FieldValues',
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
  // FieldValues.associate = function(models) {
  //   FieldValues.belongsTo(models.fields, {
  //     foreignKey: 'fieldId',
  //     as: 'fld',
  //   });
  //   FieldValues.belongsTo(models.records, {
  //     foreignKey: 'recordId',
  //     as: 'rec',
  //   });
  //   FieldValues.hasMany(models.multipleAttachmentValues, {
  //     foreignKey: 'fieldValueId',
  //     as: 'multiAttV',
  //   });
  //   FieldValues.hasMany(models.foreignKeyValues, {
  //     foreignKey: 'symmetricFieldValueId',
  //     as: 'symKV',
  //   });
  //   FieldValues.hasMany(models.foreignKeyValues, {
  //     foreignKey: 'fieldValueId',
  //     as: 'fgnKV',
  //   });
  // };
  return FieldValues;
};
