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
        {
          id: 'tbl1e6d1c73b404017',
          name: 'Table 1',
          baseId: 'bse1jT7ZIDLmjH5',
          createdAt: '2019-01-14T02:58:19.798Z',
          updatedAt: '2019-01-14T02:58:19.798Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tables', null, {});
  },
};
