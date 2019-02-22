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
      allowNull: false,
      type: DataTypes.STRING,
    },
    properties: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
    templateId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
  return Apps;
};
