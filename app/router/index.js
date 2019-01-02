const Router = require('koa-router');
const router = new Router();

const { resolveGetBases, resolveCreateBase } = require('../resolvers/bases');
const { resolveGetTables, resolveGetTable } = require('../resolvers/tables');
const { resolveCreateField } = require('../resolvers/fields');
const {
  resolveCreateOrUpdatePrimitiveField,
  resoverUpdateArrayTypeByAdding,
  resolveClearFieldValue,
} = require('../resolvers/fieldValues');
const { resolveCreateRecord } = require('../resolvers/records');
const {
  resolveGetUsers,
  resolveCreateUser,
  resolveLogin,
  resolveTestAuth,
} = require('../resolvers/users');

const { checkTableExist } = require('../middlewares/tables');

// App
router.get('/api/public/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', resolveGetBases);
router.post('/api/base', resolveCreateBase);

//Table
router.get('/api/tables/:baseId', resolveGetTables);
router.get('/api/table/:tableId', checkTableExist, resolveGetTable);

//Field
router.post('/api/field', checkTableExist, resolveCreateField);

//Record
router.post('/api/record', checkTableExist, resolveCreateRecord);

//FieldValue
router.put('/api/primitive-field', resolveCreateOrUpdatePrimitiveField);
router.post('/api/array-field', resoverUpdateArrayTypeByAdding);
router.put('/api/clear-field-value', resolveClearFieldValue);

//Users
router.get('/api/users', resolveGetUsers);
router.post('/api/public/user', resolveCreateUser);
router.post('/api/public/login', resolveLogin);
router.get('/api/public/test-auth', resolveTestAuth);

module.exports = router;
