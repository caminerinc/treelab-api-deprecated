const { get, findIndex } = require('lodash');
const fldValQueries = require('../queries/fieldValues');
const { error, Status, ECodes } = require('../util/error');

const updateArrayByAdding = async (recordId, fieldId, value) => {
  const fieldValue = await fldValQueries.findOrCreate(recordId, fieldId);
  if (!fieldValue) error(Status.Forbidden, ECodes.FIELD_VALUE_NOT_FOUND);

  // Retrieve the current array value, and make sure its an array.
  const values = get(fieldValue, 'value', []);
  const updatedValues = Array.isArray(values)
    ? values.concat([value])
    : [value];

  return await fldValQueries.updateValue(recordId, fieldId, updatedValues);
};

const updateArrayByRemoving = async (recordId, fieldId, item) => {
  const fieldValue = await fldValQueries.find(recordId, fieldId);
  if (!fieldValue) error(Status.Forbidden, ECodes.FIELD_VALUE_NOT_FOUND);

  // Check if it is an array
  const values = get(fieldValue, 'value.value', []);
  if (!Array.isArray(values))
    error(Status.Forbidden, ECodes.FIELD_VALUE_NOT_ARRAY);

  // Check if item exists
  const index = findIndex(values, item);
  if (index === -1) error(Status.Forbidden, ECodes.ITEM_NOT_FOUND);

  const updatedValues = values
    .slice(0, index)
    .concat(values.slice(index + 1, values.length));

  return await fldValQueries.updateValue(recordId, fieldId, updatedValues);
};

module.exports = {
  createFieldValue(params) {
    return fieldValues.create(params);
  },

  upsertPrimitive(params) {
    return fldValQueries.upsert(params);
  },

  async updateArrayFieldTypesByAdding(params) {
    const { recordId, fieldId, value, referenceColumnId } = params;
    await updateArrayByAdding(recordId, fieldId, value);

    if (params.type === 'reference') {
      await updateArrayByAdding(value.referenceRowId, referenceColumnId, {
        referenceRowId: recordId,
      });
    }
  },

  async deleteArrayFieldTypesByRemoving(params) {
    const { recordId, fieldId, item, referenceColumnId } = params;
    await updateArrayByRemoving(recordId, fieldId, item);

    if (params.type === 'reference') {
      await updateArrayByRemoving(item.referenceRowId, referenceColumnId, {
        referenceRowId: recordId,
      });
    }
  },

  delete({ recordId, fieldId }) {
    // TODO Handle destroying reference keys
    return fldValQueries.destroy(recordId, fieldId);
  },

  // async bulkCopyFieldValue({
  //   sourceColumnConfigs,
  //   sourceCellValues2dArray,
  //   tableId,
  // }) {
  //   for (let i = 0; i < sourceColumnConfigs.length; i++) {
  //     const field = sourceColumnConfigs[i];
  //     field.tableId = tableId;
  //     const fieldResult = await createField(field);
  //     for (let j = 0; j < sourceCellValues2dArray.length; j++) {
  //       const values = sourceCellValues2dArray[j][i];
  //       const recordResult = await createRecord(tableId);
  //       if (field.fieldTypeId == 1 || field.fieldTypeId == 2) {
  //         module.exports.upsertFieldValue({
  //           fieldTypeId: field.fieldTypeId,
  //           recordId: recordResult.id,
  //           fieldId: fieldResult.fieldId,
  //           value: values,
  //         });
  //       } else if (field.fieldTypeId == 3) {
  //         for (let k = 0; k < values.length; k++) {
  //           await module.exports.createArrayValue({
  //             recordId: recordResult.id,
  //             fieldId: fieldResult.foreignFieldId,
  //             fieldTypeId: field.fieldTypeId,
  //             value: {
  //               foreignRowId: values[k].foreignRowId,
  //               foreignColumnId: fieldResult.symmetricFieldId,
  //             },
  //           });
  //         }
  //       } else if (field.fieldTypeId == 4) {
  //         for (let k = 0; k < values.length; k++) {
  //           const fieldValueResult = await fieldValues.findOrCreateFieldValue(
  //             recordResult.id,
  //             fieldResult.fieldId,
  //           );
  //           await module.exports.createArrayValue({
  //             fieldTypeId: field.fieldTypeId,
  //             fieldValueId: fieldValueResult.id,
  //             value: values[k],
  //           });
  //         }
  //       } else {
  //         error(Status.Forbidden, ECodes.UNSURPPORTED_FIELD_TYPE);
  //       }
  //     }
  //   }
  // },
};
