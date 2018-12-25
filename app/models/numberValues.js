module.exports = (sequelize, DataTypes) => {
  const numberValues = sequelize.define(
    'numberValues',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return numberValues;
};
