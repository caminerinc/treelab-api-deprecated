module.exports = (sequelize, DataTypes) => {
  const textValues = sequelize.define(
    'textValues',
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
  return textValues;
};
