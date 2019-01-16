const Router = require('koa-router');
const router = new Router();

const { resolveGetBases, resolveCreateBase } = require('../resolvers/bases');
const {
  resolveGetTables,
  resolveGetTable,
  resolveCreateTable,
  resolveDeleteTable,
} = require('../resolvers/tables');
const {
  resolveCreateField,
  resolveDeleteField,
} = require('../resolvers/fields');
const {
  resolveCreateOrUpdatePrimitiveField,
  resolveUpdateArrayTypeByAdding,
  resolveClearFieldValue,
  resolveBulkCopyFieldValue,
} = require('../resolvers/fieldValues');
const {
  resolveCreateRecord,
  resolveDeleteRecord,
} = require('../resolvers/records');
const {
  resolveGetUsers,
  resolveCreateUser,
  resolveLogin,
  resolveTestAuth,
} = require('../resolvers/users');
const { resolveChangePosition } = require('../resolvers/positions');
const { resolveGetPouches, resolveGetPouch } = require('../resolvers/pouches');
const {
  resolveGetModules,
  resolveExtraction,
} = require('../resolvers/modules');
const { resolveAddData } = require('../resolvers/test');

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
router.get('/api/table/:tableId', resolveGetTable);
router.post('/api/table', resolveCreateTable);
router.delete('/api/table/:tableId', resolveDeleteTable);

//Field
router.post('/api/field', checkTableExist, resolveCreateField);
router.delete('/api/delete-field', resolveDeleteField);

//Record
router.post('/api/record', checkTableExist, resolveCreateRecord);
router.delete('/api/delete-rows', resolveDeleteRecord);

//FieldValue
router.put('/api/primitive-field', resolveCreateOrUpdatePrimitiveField);
router.post('/api/array-field', resolveUpdateArrayTypeByAdding);
router.delete('/api/clear-field-value', resolveClearFieldValue);
router.post('/api/bulk-copy-field-value', resolveBulkCopyFieldValue);

//Position
router.put('/api/change-position', resolveChangePosition);

//Pouch
router.get('/api/pouches', resolveGetPouches);
router.get('/api/pouch/:pouchId', resolveGetPouch);

//Module
router.get('/api/modules', resolveGetModules);
router.post('/api/module/extraction', resolveExtraction);

//Users
router.get('/api/users', resolveGetUsers);
router.post('/api/public/user', resolveCreateUser);
router.post('/api/public/login', resolveLogin);
router.get('/api/public/test-auth', resolveTestAuth);

//Test
router.get('/test/addData', resolveAddData);

module.exports = router;
