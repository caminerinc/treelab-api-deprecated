const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const bases = sequelize.define(
    'bases',
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
    },
    {},
  );
  bases.associate = function(models) {
    bases.hasMany(models.tables, {
      foreignKey: 'baseId',
      as: 'tables',
    });
    bases.hasMany(models.positions, {
      foreignKey: 'parentId',
      as: 'tablePositions',
    });
    bases.hasOne(models.positions, {
      foreignKey: 'id',
      as: 'pos',
    });
  };
  return bases;
};
