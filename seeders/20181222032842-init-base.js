'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'bases',
      [
        {
          id: 'bse1jT7ZIHLmjH4',
          name: 'Pygmy',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'bse1jT7ZIDLmjH5',
          name: 'Dumbo',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bases', null, {});
  },
};
