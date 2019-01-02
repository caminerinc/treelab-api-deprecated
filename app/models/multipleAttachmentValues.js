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
        type: DataTypes.STRING,
      },
      fieldValueId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileType: DataTypes.STRING,
    },
    {},
  );
  return multipleAttachmentValues;
};
