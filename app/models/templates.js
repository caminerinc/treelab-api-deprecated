module.exports = (sequelize, DataTypes) => {
  const Templates = sequelize.define('Templates', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    data: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
  });
  return Templates;
};
