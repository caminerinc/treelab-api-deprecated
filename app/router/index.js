const Router = require('koa-router');
const router = new Router();

const basesResolver = require('../resolvers').bases;
const usersResolver = require('../resolvers').users;

// App
router.get('/api/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', basesResolver.getBases);
router.get('/api/base/:baseId', basesResolver.getBaseById);
router.post('/api/base', basesResolver.createBase);

//Users
router.get('/api/users', usersResolver.users);
router.post('/api/user', usersResolver.user);

module.exports = router;
