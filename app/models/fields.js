const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

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
      typeOptionsId: DataTypes.INTEGER,
    },
    {},
  );
  fields.associate = function(models) {
    fields.hasMany(models.fieldValues, {
      foreignKey: 'fieldId',
      as: 'fieldValues',
    });
  };
  return fields;
};
