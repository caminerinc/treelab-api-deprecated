module.exports = (sequelize, DataTypes) => {
  const Positions = sequelize.define(
    'Positions',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      parentId: {
        allowNull: false,
        type: DataTypes.STRING,
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
  // Positions.associate = function(models) {
  //   Positions.belongsTo(models.fields, {
  //     foreignKey: 'id',
  //     as: 'field',
  //   });
  // };
  return Positions;
};
