'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'foreignKeyTypes',
        [
          {
            relationship: 'many',
            foreignTableId: 'tblsnmRLfttLmAYQ8',
            symmetricFieldId: 'fld6tojhqApRQfJ2d',
            fieldId: 'fld6tojhqApRQfJpi',
            createdAt: '2018-05-05T04:09:06.024Z',
            updatedAt: '2018-05-05T04:09:06.024Z',
          },
          {
            relationship: 'many',
            foreignTableId: 'tblNGUPdSs9Va4X5u',
            symmetricFieldId: 'fld6tojhqApRQfJpi',
            fieldId: 'fld6tojhqApRQfJ2d',
            createdAt: '2018-05-05T04:09:06.024Z',
            updatedAt: '2018-05-05T04:09:06.024Z',
          },
        ],
        {},
      )
      .then(async () => {
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
    return queryInterface.bulkDelete('foreignKeyTypes', null, {});
  },
};
