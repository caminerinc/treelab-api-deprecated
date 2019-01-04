const { getBlock } = require('./../blocks');
const { attachmentExtraction } = require('./../extraction');

const attachmentExtractionTrigger = async params => {
  let where = {};
  if (params.tableId) where.triggerTableId = params.tableId;
  if (params.fieldId) where.triggerFieldId = params.fieldId;
  const block = await getBlock(where);
  if (!block) return;
  let _params = {
    url: params.value.url,
    fileType: params.value.fileType,
  };
  return await attachmentExtraction(_params);
};

module.exports = {
  attachmentExtractionTrigger,
};
