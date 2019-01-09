module.exports = (sequelize, DataTypes) => {
  const numberTypes = sequelize.define(
    'numberTypes',
    {
      format: DataTypes.STRING,
      precision: DataTypes.INTEGER,
      negative: DataTypes.BOOLEAN,
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return numberTypes;
};
