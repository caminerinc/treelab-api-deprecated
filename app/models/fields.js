module.exports = (sequelize, DataTypes) => {
  const Fields = sequelize.define(
    'Fields',
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
      tableId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      fieldTypeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      width: {
        type: DataTypes.INTEGER,
      },
      typeOptions: {
        type: DataTypes.JSONB,
      },
    },
    {},
  );
  Fields.associate = function(models) {
    Fields.hasMany(models.FieldValues, {
      foreignKey: 'fieldId',
      as: 'fldVs',
    });
    Fields.hasOne(models.FieldPositions, {
      foreignKey: 'parentId',
      as: 'pos',
    });
  };
  return Fields;
};
