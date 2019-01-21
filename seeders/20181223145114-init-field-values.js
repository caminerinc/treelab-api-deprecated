'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'fieldValues',
      [
        {
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fldnQ4OWns9ZF88nC',
          textValue: 'Rob',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recfPInitd1QpZ6aV',
          fieldId: 'fldnQ4OWns9ZF88nC',
          textValue: 'Muller',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fld6tojhqApRQfJpc',
          textValue: 'Ricky',
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recfPInitd1QpZ6aV',
          fieldId: 'fld6tojhqApRQfJpc',
          textValue: 'Ren',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fld6tojhqApRQfJpd',
          numberValue: 24,
          createdAt: '018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recfPInitd1QpZ6aV',
          fieldId: 'fld6tojhqApRQfJpd',
          numberValue: 34,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fldIwYLcbYWSUa4aK',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'recwEKHeMhcDnLnfc',
          fieldId: 'fld6tojhqApRQfJpi',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'rec1db61c8d540400f',
          fieldId: 'fld6tojhqApRQfJ2d',
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          recordId: 'rec1db61c8d540400f',
          fieldId: 'fld1e1ce9eefc0401b',
          textValue: 'lim',
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
