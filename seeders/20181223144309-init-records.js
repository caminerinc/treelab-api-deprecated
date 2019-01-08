'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'records',
      [
        {
          id: 'recfPInitd1QpZ6aC',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6aE',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6aV',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6ef',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6sf',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6vc',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recsdfFDfdfdDSD',
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recwEKHeMhcDnLnfc',
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
