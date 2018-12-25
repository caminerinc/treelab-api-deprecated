'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'usr1jT7ZIHLmjH4111',
          firstName: 'carson',
          lastName: 'cai',
          email: 'carson@caminer.io',
          passwordDigest: 'aaa',
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: 'usr1jT7ZIHLmjH4112',
          firstName: '小明',
          lastName: '王',
          email: 'xiaoming@caminer.io',
          passwordDigest: 'bbb',
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
