'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: '1b47b064-40c6-4151-9d7b-65a79b6a2eab',
          firstName: 'Jon',
          lastName: 'Snow',
          email: 'jon@caminer.io',
          passwordDigest: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '980676d8-2432-4f8e-acd7-220b7d7dde0d',
          firstName: 'Jamie',
          lastName: 'Lannister',
          email: 'jamie@caminer.io',
          passwordDigest: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
