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
        },
        {
          id: 'usr1jT7ZIHLmjH4112',
          firstName: '小明',
          lastName: '王',
          email: 'xiaoming@caminer.io',
          passwordDigest: 'bbb',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
