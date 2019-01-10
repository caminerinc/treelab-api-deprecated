'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
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
        {
          relationship: 'one',
          foreignTableId: 'tblNGUPdSs9Va4X5u',
          symmetricFieldId: 'fld1e1cf1f8f80404b',
          fieldId: 'fld1e1cf1f8dc0403b',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          relationship: 'one',
          foreignTableId: 'tblsnmRLfttLmAYQ8',
          symmetricFieldId: 'fld1e1cf1f8dc0403b',
          fieldId: 'fld1e1cf1f8f80404b',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('foreignKeyTypes', null, {});
  },
};
