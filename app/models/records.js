module.exports = (sequelize, DataTypes) => {
  const Records = sequelize.define('Records', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    tableId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  });
  Records.associate = function(models) {
    Records.hasMany(models.FieldValues, {
      foreignKey: 'recordId',
      as: 'fldVs',
    });
  };
  return Records;
};
