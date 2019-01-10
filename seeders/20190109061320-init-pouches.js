module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'pouches',
      [
        {
          id: 'pch12984y9128',
          name: 'My extraction Pouch',
          moduleId: 'mdl812h39u12',
          baseId: 'bse1jT7ZIHLmjH4',
          triggerTableId: 'tblNGUPdSs9Va4X5u',
          triggerFieldId: 'fldIwYLcbYWSUa4aK',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pouches', null, {});
  },
};
