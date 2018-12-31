module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'usr1ce47a1a900403f',
          firstName: 'Jon',
          lastName: 'Snow',
          email: 'jon@caminer.io',
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
