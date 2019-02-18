module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'FieldTypes',
      [
        {
          id: '9',
          name: 'select',
          isPrimitive: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FieldTypes', {
      where: { id: { $in: [9] } },
    });
  },
};
