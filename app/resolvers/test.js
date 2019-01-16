const records = require('../controllers/records');
const fields = require('../controllers/fields');

module.exports = {
  resolveAddData: async ctx => {
    let fieldIds = [];
    for (let i = 0; i < 10; i++) {
      const params = {
        name: `test${i}`,
        fieldTypeId: 1,
        tableId: 'tblNGUPdSs9Va4X5u',
      };
      const result = await fields.createField(params);
      fieldIds.push(result.fieldId);
    }
    for (let i = 10; i < 20; i++) {
      const params = {
        name: `test${i}`,
        fieldTypeId: 3,
        tableId: 'tblNGUPdSs9Va4X5u',
        typeOptions: {
          relationship: 'many',
          foreignTableId: 'tblsnmRLfttLmAYQ8',
        },
      };
      const result = await fields.createField(params);
      fieldIds.push(result.fieldId);
    }
    for (let i = 20; i < 30; i++) {
      const params = {
        name: `test${i}`,
        fieldTypeId: 3,
        tableId: 'tblNGUPdSs9Va4X5u',
        typeOptions: {
          relationship: 'many',
          foreignTableId: 'tblsnmRLfttLmAYQ8',
        },
      };
      const result = await fields.createField(params);
      fieldIds.push(result.fieldId);
    }

    let recordIds = [];
    for (let i = 0; i < 1000; i++) {
      const result = await records.createRecord({
        tableId: 'tblNGUPdSs9Va4X5u',
      });
      recordIds.push(result.id);
    }
    ctx.body = 'success';
  },
};
