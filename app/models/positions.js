module.exports = (sequelize, DataTypes) => {
  const positions = sequelize.define(
    'positions',
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
  positions.associate = function(models) {
    positions.belongsTo(models.fields, {
      foreignKey: 'id',
      as: 'field',
    });
  };

  const findLast = async (db, parentId, type) => {
    await positions.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('position')), 'max']],
      where: { parentId, type },
      transaction: db,
    });
  }

  const create = async (db, id, position, parentId, type) => {
    return await positions.create(
      { id, position, parentId, type },
      { transaction: db },
    );
  }
  // return positions;

  // This is the goal, having only clear functions exposed
  // The code currently doesnt work because of models/index.js "tricks".
  return {
    findLast,
    create
  };
};
