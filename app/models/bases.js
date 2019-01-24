const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  // Model definitions should be hidden to the controller.
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
  const createBase = async (db, name) => {
    return await bases.create(
      {
        name: name,
      },
      {transaction: db},
    );
  }
  // Controller should only interact with these simple functions, the DB magic
  // is hidden here.
  return {
    createBase,
  };
};
