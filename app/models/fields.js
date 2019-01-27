const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = (sequelize, DataTypes) => {
  const fields = sequelize.define(
    'fields',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.FIELD),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'fields_tableId_name_uk',
      },
      tableId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'fields_tableId_name_uk',
      },
      fieldTypeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      width: {
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  fields.associate = function(models) {
    fields.hasMany(models.fieldValues, {
      foreignKey: 'fieldId',
      as: 'fldVs',
    });
    fields.hasOne(models[FIELD_TYPES[2].typeModel], {
      foreignKey: 'fieldId',
      as: FIELD_TYPES[2].typeName,
    });
    fields.hasOne(models[FIELD_TYPES[3].typeModel], {
      foreignKey: 'fieldId',
      as: FIELD_TYPES[3].typeName,
    });
    fields.hasOne(models[FIELD_TYPES[5].typeModel], {
      foreignKey: 'fieldId',
      as: FIELD_TYPES[5].typeName,
    });
  };
  return fields;
};
