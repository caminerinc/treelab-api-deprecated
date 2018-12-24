const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      id: {
        allowNull: false,
        defaultValue: () => {
          return createUid(PREFIX_TYPE.USR);
        },
        primaryKey: true,
        type: DataTypes.CHAR(18),
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password_digest: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  return users;
};
