module.exports = (sequelize, DataTypes) => {
  const Apps = sequelize.define('Apps', {
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
    description: {
      type: DataTypes.STRING,
    },
    properties: {
      type: DataTypes.JSONB,
    },
    templateId: {
      type: DataTypes.INTEGER,
    },
  });
  return Apps;
};
