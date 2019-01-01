module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'fields',
      [
        {
          id: 'fldnQ4OWns9ZF88nC',
          name: 'First Name',
          fieldTypeId: 1,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpc',
          name: 'Last Name',
          fieldTypeId: 1,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpd',
          name: 'Age',
          fieldTypeId: 2,
          typeOptionId: 1,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpi',
          name: 'Link to PO',
          fieldTypeId: 3,
          typeOptionId: 2,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJ2d',
          name: 'Link to Order',
          fieldTypeId: 3,
          typeOptionId: 3,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fields', null, {});
  },
};
