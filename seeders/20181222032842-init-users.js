'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'usr1jT7ZIHLmjH4111',
          first_name: 'carson',
          last_name: 'cai',
          email: 'carson@caminser.io',
          password_digest: 'aaa',
        },
        {
          id: 'usr1jT7ZIHLmjH4112',
          first_name: '小明',
          last_name: '王',
          email: 'xiaoming@caminser.io',
          password_digest: 'bbb',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
