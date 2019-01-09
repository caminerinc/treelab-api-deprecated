const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const modules = sequelize.define(
    'modules',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.MODULE),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );

  return modules;
};
