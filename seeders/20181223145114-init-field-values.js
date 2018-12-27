'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'fieldValues',
      [
        {
          id: 1,
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fldnQ4OWns9ZF88nC',
          textValueId: 1,
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 2,
          recordId: 'recfPInitd1QpZ6aV',
          fieldId: 'fldnQ4OWns9ZF88nC',
          textValueId: 2,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 3,
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fld6tojhqApRQfJpc',
          textValueId: 3,
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 4,
          recordId: 'recfPInitd1QpZ6aV',
          fieldId: 'fld6tojhqApRQfJpc',
          textValueId: 4,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 5,
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fldIwYLcbYWSUa4aK',
          multipleAttachmentValueId: 'attqdl74Yu4DjbLvc',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fieldValues', null, {});
  },
};
