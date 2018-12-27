const Router = require('koa-router');
const router = new Router();

const basesResolver = require('../resolvers').bases;
const tablesResolver = require('../resolvers').tables;
const fieldsResolver = require('../resolvers').fields;
const recordsResolver = require('../resolvers').records;
const usersResolver = require('../resolvers').users;

const tableMiddleware = require('../middlewares').tables;

// App
router.get('/api/public/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', basesResolver.getBases);
router.post('/api/base', basesResolver.createBase);

//Table
router.get('/api/tables/:baseId', tablesResolver.getTables);
router.get(
  '/api/table/:tableId',
  tableMiddleware.checkTableExist,
  tablesResolver.getTable,
);

//Field
router.post(
  '/api/field',
  tableMiddleware.checkTableExist,
  fieldsResolver.createField,
);

//Record
router.post(
  '/api/record',
  tableMiddleware.checkTableExist,
  recordsResolver.createRecord,
);

//Users
router.get('/api/users', usersResolver.users);
router.post('/api/public/user', usersResolver.user);
router.post('/api/public/login', usersResolver.login);
router.get('/api/public/test-auth', usersResolver.testAuth);

module.exports = router;
