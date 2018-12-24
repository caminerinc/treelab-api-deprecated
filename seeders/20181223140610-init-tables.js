'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'tables',
      [
        {
          id: 'tblNGUPdSs9Va4X5u',
          name: 'Orders',
          baseId: 'bse1jT7ZIHLmjH4',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'tblsnmRLfttLmAYQ8',
          name: 'PO',
          baseId: 'bse1jT7ZIHLmjH4',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tables', null, {});
  },
};
