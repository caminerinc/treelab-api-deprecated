const Router = require('koa-router');
const router = new Router();

const { getBases, createBase } = require('../resolvers/bases');
const { getTables, getTable } = require('../resolvers/tables');
const { createField } = require('../resolvers/fields');
const { createOrUpdatePrimitiveField } = require('../resolvers/fieldValues');
const { createRecord } = require('../resolvers/records');
const { getUsers, createUser, login, testAuth } = require('../resolvers/users');
const { updateArrayTypeByAdding } = require('../resolvers/attachment');

const { checkTableExist } = require('../middlewares/tables');

// App
router.get('/api/public/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', getBases);
router.post('/api/base', createBase);

//Table
router.get('/api/tables/:baseId', getTables);
router.get('/api/table/:tableId', checkTableExist, getTable);

//Field
router.post('/api/field', checkTableExist, createField);

//Record
router.post('/api/record', checkTableExist, createRecord);

//FieldValue
router.put('/api/primitive-field', createOrUpdatePrimitiveField);

//Users
router.get('/api/users', getUsers);
router.post('/api/public/user', createUser);
router.post('/api/public/login', login);
router.get('/api/public/test-auth', testAuth);

//attachment
router.post('/api/array-field', updateArrayTypeByAdding);

module.exports = router;
