const Router = require('koa-router');
const router = new Router();

const basesResolver = require('../resolvers').bases;

// App
router.get('/api/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases/:baseId', basesResolver.getBaseById);

module.exports = router;
