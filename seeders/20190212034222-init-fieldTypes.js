module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'FieldTypes',
      [
        {
          id: '1',
          name: 'text',
          isPrimitive: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '2',
          name: 'number',
          isPrimitive: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '3',
          name: 'reference',
          isArray: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '4',
          name: 'multipleAttachment',
          isArray: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FieldTypes', null, {});
  },
};
