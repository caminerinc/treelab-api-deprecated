const dbConfig = require('./db-config.json');

module.exports = {
  port: 8081,
  testPort: 8000,
  socketIoPort: 9001,
  postgres: dbConfig,
  tokenExpiresIn: '10h',
  offlineDelayTime: 2000,
  url: {
    attachmentExtraction: 'http://52.81.16.146:5000/extract_service',
  },
  sharedSecret: 'shared-secret',
  nodeEnv: 'develop',
  passThrough: true,
};
