const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = (sequelize, DataTypes) => {
  const Fields = sequelize.define(
    'Fields',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      tableId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      fieldTypeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      width: {
        type: DataTypes.INTEGER,
      },
      typeOptions: {
        type: DataTypes.JSONB,
      },
    },
    {},
  );
  Fields.associate = function(models) {
    // Fields.hasMany(models.fieldValues, {
    //   foreignKey: 'fieldId',
    //   as: 'fldVs',
    // });
    Fields.hasOne(models.Positions, {
      foreignKey: 'id',
      as: 'pos',
    });
  };
  return Fields;
};
