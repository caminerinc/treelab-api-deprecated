'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'blocks',
      [
        {
          id: 'blk1jT7ZIHLmjk4',
          name: 'extraction',
          triggerTableId: 'tblNGUPdSs9Va4X5u',
          triggerFieldId: 'fld6tojhqApRQfJ2d',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('blocks', null, {});
  },
};
