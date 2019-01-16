const records = require('../app/controllers/records');
const fields = require('../app/controllers/fields');

let fieldIds = [];
for (let i = 0; i < 10; i++) {
  const params = {
    name: `test${i}`,
    fieldTypeId: 1,
    tableId: 'tblNGUPdSs9Va4X5u',
  };
  const result = fields.createField(params);
  fieldIds.push(result.fieldId);
}
for (let i = 10; i < 20; i++) {
  const params = {
    name: `test${i}`,
    fieldTypeId: 2,
    tableId: 'tblNGUPdSs9Va4X5u',
  };
  const result = fields.createField(params);
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
  const result = fields.createField(params);
  fieldIds.push(result.fieldId);
}
for (let i = 30; i < 40; i++) {
  const params = {
    name: `test${i}`,
    fieldTypeId: 3,
    tableId: 'tblNGUPdSs9Va4X5u',
    typeOptions: {
      relationship: 'many',
      foreignTableId: 'tblsnmRLfttLmAYQ8',
    },
  };
  const result = ields.createField(params);
  fieldIds.push(result.fieldId);
}

let recordIds = [];
for (let i = 0; i < 10000; i++) {
  const result = records.createRecord({ tableId: 'tblNGUPdSs9Va4X5u' });
  recordIds.push(result.id);
}
