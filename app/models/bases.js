'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bases = sequelize.define('Bases', {
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
  });
  Bases.associate = function(models) {
    Bases.hasMany(models.Tables, {
      foreignKey: 'baseId',
      as: 'tables',
    });
    Bases.hasMany(models.Positions, {
      foreignKey: 'parentId',
      as: 'tablePositions',
    });
    Bases.hasOne(models.Positions, {
      foreignKey: 'id',
      as: 'pos',
    });
  };
  return Bases;
};
