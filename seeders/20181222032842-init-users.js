'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'usr1ce47a1a900403f',
          firstName: 'Jon',
          lastName: 'Snow',
          email: 'test@caminer.io',
          passwordDigest: '3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d',
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
