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
      },
      tableId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fieldTypeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  fields.associate = function(models) {
    fields.hasMany(models.fieldValues, {
      foreignKey: 'fieldId',
      as: 'fieldValues',
    });
    fields.belongsTo(models.typeOptions, {
      foreignKey: 'typeOptionId',
      as: 'typeOptions',
    });
    fields.hasOne(models[FIELD_TYPES[2].typeModel], {
      foreignKey: 'fieldId',
      as: FIELD_TYPES[2].typeName,
    });
    fields.hasOne(models[FIELD_TYPES[3].typeModel], {
      foreignKey: 'fieldId',
      as: FIELD_TYPES[3].typeName,
    });
  };
  return fields;
};
