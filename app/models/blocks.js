const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const blocks = sequelize.define(
    'blocks',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.BLK),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      triggerTableId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      triggerFieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  blocks.associate = function(models) {
    // associations can be defined here
  };
  return blocks;
};
