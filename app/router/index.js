const Router = require('koa-router');
const router = new Router();

// App
router.get('/api/health-check', ctx => {
  ctx.body = 'Connection established';
});

module.exports = router;
