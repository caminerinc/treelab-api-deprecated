'use strict';
const path = require('path');

module.exports = appInfo => {
  return {
    cluster: {
      listen: {
        port: 9000
      },
    },
    keys: appInfo.name + '20181220',
    logger: {
      consoleLevel: 'info',
      level: 'info',
      dir: path.join(appInfo.baseDir, 'logs')
    },
    logrotator: {
      maxDays: 3
    },
    session: {
      key: 'intelligarm',
      maxAge: 24 * 3600 * 1000,
    },
    middleware: ['errorHandler'],
    security: {
      csrf: {
        enable: false,
        ignoreJSON: true
      },
    },
    cors: {
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  };
};