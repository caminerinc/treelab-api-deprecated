module.exports = (sequelize, DataTypes) => {
  const FieldValues = sequelize.define(
    'FieldValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      recordId: {
        allowNull: false,
        type: DataTypes.UUID,
        unique: 'fieldValues_recordId_fieldId_uk',
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.UUID,
        unique: 'fieldValues_recordId_fieldId_uk',
      },
      value: DataTypes.JSONB,
    },
    {},
  );
  FieldValues.associate = function(models) {
    FieldValues.belongsTo(models.Fields, {
      foreignKey: 'fieldId',
      as: 'fld',
    });
    FieldValues.belongsTo(models.Records, {
      foreignKey: 'recordId',
      as: 'rec',
    });
  };
  return FieldValues;
};
