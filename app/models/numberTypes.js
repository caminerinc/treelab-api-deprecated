module.exports = (sequelize, DataTypes) => {
  const numberTypes = sequelize.define(
    'numberTypes',
    {
      format: DataTypes.STRING,
      precision: DataTypes.INTEGER,
      negative: DataTypes.BOOLEAN,
    },
    {},
  );
  return numberTypes;
};
