module.exports = (sequelize, DataTypes) => {
  const Tables = sequelize.define(
    'Tables',
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
      baseId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
    },
    {},
  );
  Tables.associate = function(models) {
    Tables.hasMany(models.Fields, {
      foreignKey: 'tableId',
      as: 'flds',
    });
    Tables.hasMany(models.Records, {
      foreignKey: 'tableId',
      as: 'recs',
    });
    Tables.hasMany(models.Positions, {
      foreignKey: 'parentId',
      as: 'positions',
    });
    Tables.hasOne(models.Positions, {
      foreignKey: 'id',
      as: 'pos',
    });
  };
  return Tables;
};
