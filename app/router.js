'use strict';

module.exports = app => {
  //api
  app.router.get('/api/health-check', app.controller.api.healthCheck);
};
