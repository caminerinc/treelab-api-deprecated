module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      numberValue: DataTypes.INTEGER,
    },
    {},
  );
  fieldValues.associate = function(models) {
    fieldValues.belongsTo(models.fields, {
      foreignKey: 'fieldId',
      as: 'field',
    });
    fieldValues.hasMany(models.multipleAttachmentValues, {
      foreignKey: 'fieldValueId',
      as: 'multipleAttachmentValues',
    });
    fieldValues.hasMany(models.foreignKeyValues, {
      foreignKey: 'fieldValueId',
      as: 'foreignKeyValue',
    });
  };
  return fieldValues;
};
