'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'multipleAttachmentValues',
      [
        {
          id: 'attqdl74Yu4DjbLvc',
          url:
            'https://dl.airtable.com/yP8sUJ2qQ22T0Jl8cBS4_W%20THXU%20SHACKER%20SL%20PO%20-%209.27%20Fit%20rej.pdf',
          filename: 'W THXU SHACKER SL PO - 9.27 Fit rej.pdf',
          filetype: 'application/pdf',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('multipleAttachmentValues', null, {});
  },
};
