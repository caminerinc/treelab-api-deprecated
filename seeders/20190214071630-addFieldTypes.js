module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'FieldTypes',
      [
        {
          id: '5',
          name: 'multilineText',
          isPrimitive: true,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
        {
          id: '6',
          name: 'multiSelect',
          isArray: true,
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
