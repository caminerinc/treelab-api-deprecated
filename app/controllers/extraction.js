const request = require('request-promise');
const config = require('../../config/config');
const querystring = require('querystring');

const attachmentExtraction = async params => {
  if (!params.url) {
    throw new Error('url is required');
  }
  if (!params.fileType) {
    throw new Error('fileType is required');
  }
  const result = await request.get(
    `${config.url.attachmentExtraction}?${querystring.stringify(params)}`,
  );
  return result;
};

module.exports = {
  attachmentExtraction,
};
