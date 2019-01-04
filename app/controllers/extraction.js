const request = require('request-promise');
const config = require('../../config/config');

const attachmentExtraction = async params => {
  if (!params.url) {
    throw new Error('url is required');
  }
  if (!params.fileType) {
    throw new Error('fileType is required');
  }
  const result = await request({
    url: config.url.attachmentExtraction,
    method: 'GET',
    body: params,
  });
  return result;
};

module.exports = {
  attachmentExtraction,
};
