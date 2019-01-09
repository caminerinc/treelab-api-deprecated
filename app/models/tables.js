const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const tables = sequelize.define(
    'tables',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.BASE),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      primaryFieldId: DataTypes.STRING,
      baseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  tables.associate = function(models) {
    tables.hasMany(models.fields, {
      foreignKey: 'tableId',
      as: 'flds',
    });
    tables.hasMany(models.fields, {
      foreignKey: 'tableId',
      as: 'fieldPositions',
    });
    tables.hasMany(models.records, {
      foreignKey: 'tableId',
      as: 'recs',
    });
    tables.hasMany(models.records, {
      foreignKey: 'tableId',
      as: 'recordPositions',
    });
  };
  return tables;
};
