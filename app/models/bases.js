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
  /*
    Looks like we really can't put queries here unless we do
    bases.getBases = () => {}

    However, when we do queries in here we also need other models for the associations.
    I think the models/index.js file is set in stone for sequelize, so we really need it, unless
    there is another way of writing it. Mainly I think its how they connect the associations.
  */
  return bases;
};
