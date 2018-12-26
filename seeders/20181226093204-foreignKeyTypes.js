'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'foreignKeyTypes',
      [
        {
          relationship: 'many',
          foreignTableId: 'tblNGUPdSs9Va4X5u',
          symmetricFieldId: 'fld6tojhqApRQfJpc',
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
