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
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    },
  );
  return users;
};
