'use strict';

module.exports = app => {
  const { router, controller } = app;
  //api
  router.get('/api/health-check', controller.app.healthCheck);
};
