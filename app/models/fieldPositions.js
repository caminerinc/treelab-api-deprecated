module.exports = (sequelize, DataTypes) => {
  const FieldPositions = sequelize.define(
    'FieldPositions',
    {
      parentId: DataTypes.UUID,
      position: DataTypes.INTEGER,
      siblingId: DataTypes.UUID,
    },
    {
      timestamps: false,
    },
  );
  FieldPositions.associate = function(models) {
    FieldPositions.belongsTo(models.Fields, {
      foreignKey: 'siblingId',
      as: 'field',
    });
  };
  return FieldPositions;
};
