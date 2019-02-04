module.exports = (sequelize, DataTypes) => {
  const Positions = sequelize.define(
    'Positions',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      parentId: {
        type: DataTypes.UUID,
      },
      position: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  Positions.associate = function(models) {
    Positions.belongsTo(models.Fields, {
      foreignKey: 'id',
      as: 'field',
    });
  };
  return Positions;
};
