'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'numberValues',
      [
        {
          id: 1,
          value: 18,
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 2,
          value: 18,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('numberValues', null, {});
  },
};
