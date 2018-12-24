'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'records',
      [
        {
          id: 'recwEKHeMhcDnLnfc',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6aV',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('records', null, {});
  },
};
