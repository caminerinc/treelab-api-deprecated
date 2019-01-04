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
            createdAt: '2018-05-05T04:09:06.024Z',
            updatedAt: '2018-05-05T04:09:06.024Z',
          },
          {
            relationship: 'many',
            foreignTableId: 'tblNGUPdSs9Va4X5u',
            symmetricFieldId: 'fld6tojhqApRQfJpi',
            createdAt: '2018-05-05T04:09:06.024Z',
            updatedAt: '2018-05-05T04:09:06.024Z',
          },
        ],
        {},
      )
      .then(async () => {
        await queryInterface.addConstraint(
          'multipleAttachmentValues',
          ['fieldValueId'],
          {
            type: 'FOREIGN KEY',
            references: {
              table: 'fieldValues',
              field: 'id',
            },
            onDelete: 'cascade',
          },
        );
        await queryInterface.addConstraint('fieldValues', ['fieldId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'fields',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint('typeOptions', ['numberTypeId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'numberTypes',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        await queryInterface.addConstraint(
          'typeOptions',
          ['foreignKeyTypeId'],
          {
            type: 'FOREIGN KEY',
            references: {
              table: 'foreignKeyTypes',
              field: 'id',
            },
            onDelete: 'cascade',
          },
        );
        await queryInterface.addConstraint('fields', ['typeOptionId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'typeOptions',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        // return queryInterface.addConstraint(
        //   'foreignKeyTypes',
        //   ['symmetricFieldId'],
        //   {
        //     type: 'FOREIGN KEY',
        //     references: {
        //       table: 'fields',
        //       field: 'id',
        //     },
        //     onDelete: 'cascade',
        //   },
        // );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('foreignKeyTypes', null, {});
  },
};
