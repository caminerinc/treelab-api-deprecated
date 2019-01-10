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
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJpi',
          name: 'Link to PO',
          fieldTypeId: 3,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld6tojhqApRQfJ2d',
          name: 'Link to Order',
          fieldTypeId: 3,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fldIwYLcbYWSUa4aK',
          name: 'Attachment List',
          fieldTypeId: 4,
          tableId: 'tblNGUPdSs9Va4X5u',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld1e1ce8af180400b',
          name: 'age',
          fieldTypeId: 2,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld1e1ce9eefc0401b',
          name: 'name',
          fieldTypeId: 1,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld1e1ced53340402b',
          name: 'recording',
          fieldTypeId: 4,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld1e1cf1f8dc0403b',
          name: 'LinkOne',
          fieldTypeId: 3,
          tableId: 'tblsnmRLfttLmAYQ8',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'fld1e1cf1f8f80404b',
          name: 'Link',
          fieldTypeId: 3,
          tableId: 'tblNGUPdSs9Va4X5u',
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
