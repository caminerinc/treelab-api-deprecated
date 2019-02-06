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
    Bases.hasOne(models.BasePositions, {
      foreignKey: 'siblingId',
      as: 'pos',
    });
    Bases.hasMany(models.TablePositions, {
      foreignKey: 'parentId',
      as: 'tablePositions',
    });
  };
  return Bases;
};
