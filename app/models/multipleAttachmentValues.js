'use strict';
const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');
module.exports = (sequelize, DataTypes) => {
  const multipleAttachmentValues = sequelize.define(
    'multipleAttachmentValues',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.ATT),
        primaryKey: true,
        type: DataTypes.CHAR(18),
      },
      url: DataTypes.STRING,
      filename: DataTypes.STRING,
      filetype: DataTypes.STRING,
    },
    {},
  );
  return multipleAttachmentValues;
};
