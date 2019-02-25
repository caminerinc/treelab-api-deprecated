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
    budId: {
      type: DataTypes.UUID,
    },
  });
  Bases.associate = function(models) {
    Bases.hasMany(models.Tables, {
      foreignKey: 'baseId',
      as: 'tables',
    });
    Bases.hasOne(models.BasePositions, {
      foreignKey: 'siblingId',
      // TODO: Fix names so it doesn't use pos - use positions
      as: 'pos',
    });
    Bases.hasMany(models.TablePositions, {
      foreignKey: 'parentId',
      as: 'tablePositions',
    });
    Bases.belongsTo(models.Buds, {
      foreignKey: 'budId',
      as: 'bud',
    });
  };
  return Bases;
};
