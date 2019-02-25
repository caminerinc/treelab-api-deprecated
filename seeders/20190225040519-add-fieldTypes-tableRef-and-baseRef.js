module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'FieldTypes',
      [
        {
          id: '10',
          name: 'tableReference',
          isArray: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '11',
          name: 'baseReference',
          isArray: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FieldTypes', {
      where: { id: { $in: [10, 11] } },
    });
  },
};
