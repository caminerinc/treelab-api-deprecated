'use strict';

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
          typeOptionsId: 2,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpd',
          name: 'age',
          fieldTypeId: 2,
          typeOptionsId: 1,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpe',
          name: 'Last Name',
          fieldTypeId: 1,
          typeOptionsId: 2,
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
