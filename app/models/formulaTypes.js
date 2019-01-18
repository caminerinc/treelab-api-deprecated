module.exports = (sequelize, DataTypes) => {
  const formulaTypes = sequelize.define(
    'formulaTypes',
    {
      formulaText: DataTypes.STRING,
      format: DataTypes.STRING,
      precision: DataTypes.INTEGER,
      symbol: DataTypes.STRING,
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return formulaTypes;
};
