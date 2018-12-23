const Router = require('koa-router');
const router = new Router();

const basesResolver = require('../resolvers').bases;

// App
router.get('/api/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
// @[DEREK] Delete this after real ones have been implemented
router.get('/api/base/:baseId', basesResolver.getBaseById);

module.exports = router;
