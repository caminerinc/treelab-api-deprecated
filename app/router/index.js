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

//Users
// @[DEREK] 获取所有用户的用户信息
router.get('/api/users', usersResolver.users);
// @[DEREK] 创建用户
router.post('/api/user', usersResolver.user);

module.exports = router;
