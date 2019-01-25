module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'formulaTypes',
      [
        {
          formulaText: 'sum({first name}, sum({first name}, {age})) + 1 * 2 - (1 + 2)',
          format: 'decimal',
          precision: 1,
          symbol: '$',
          fieldId: 'fld1f010c256c0401b',
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
