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
    Tables.hasOne(models.TablePositions, {
      foreignKey: 'siblingId',
      as: 'pos',
    });
    Tables.hasMany(models.RecordPositions, {
      foreignKey: 'parentId',
      as: 'recordPositions',
    });
    Tables.hasMany(models.FieldPositions, {
      foreignKey: 'parentId',
      as: 'fieldPositions',
    });
  };
  return Tables;
};
