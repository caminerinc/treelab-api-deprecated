module.exports = (sequelize, DataTypes) => {
  const bases = sequelize.define(
    'bases',
    {
      uid: DataTypes.STRING,
    },
    {},
  );
  bases.associate = function(models) {
    // associations can be defined here
  };
  return bases;
};
