'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'foreignKeyValues',
        [
          {
            fieldValueId: 8,
            symmetricFieldValueId: 9,
            name: 'link',
            createdAt: '2018-05-05T04:09:06.024Z',
            updatedAt: '2018-05-05T04:09:06.024Z',
          },
        ],
        {},
      )
      .then(async () => {
        await queryInterface.addConstraint('foreignKeyValues', ['fieldValueId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fieldValues',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('multipleAttachmentValues', ['fieldValueId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fieldValues',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('fieldValues', ['fieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('foreignKeyTypes', ['symmetricFieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('foreignKeyTypes', ['fieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('numberTypes', ['fieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('formulaTypes', ['fieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        return queryInterface.addConstraint('fieldValues', ['recordId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'records',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('foreignKeyValues', null, {});
  },
};
