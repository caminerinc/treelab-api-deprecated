const { getBlock } = require('./../blocks');
const { attachmentExtraction } = require('./../extraction');

const BLOCK_NAME = 'extraction';

const attachmentExtractionTrigger = async params => {
  let where = { name: BLOCK_NAME };
  if (params.tableId) where.triggerTableId = params.tableId;
  if (params.fieldId) where.triggerFieldId = params.fieldId;
  const block = await getBlock(where);
  if (!block) return;
  let _params = {
    url: params.value.url,
    fileType: params.value.fileType,
  };
  const result = await attachmentExtraction(_params);
  if (params.fieldId) {
    //TODO 根据result生成fieldValue
  }
  return result;
};

module.exports = {
  attachmentExtractionTrigger,
};
