module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'numberTypes',
      [
        {
          format: 'decimal',
          precision: 1,
          negative: false,
          fieldId: 'fld6tojhqApRQfJpd',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          format: 'decimal',
          precision: 1,
          negative: false,
          fieldId: 'fld1e1ce8af180400b',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('numberTypes', null, {});
  },
};
