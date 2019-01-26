const Router = require('koa-router');
const router = new Router();
const { sequelize } = require('../models');

const {
  resolveGetBases,
  resolveCreateBase,
  resolveDeleteBase,
  resolveGetBase,
} = require('../resolvers/bases');
const {
  resolveGetTables,
  resolveGetTable,
  resolveCreateTable,
  resolveDeleteTable,
} = require('../resolvers/tables');
const {
  resolveCreateField,
  resolveDeleteField,
  resolveResizeColumn,
  resolveUpdateField,
} = require('../resolvers/fields');
const {
  resolveCreateOrUpdatePrimitiveField,
  resolveUpdateArrayTypeByAdding,
  resolveClearFieldValue,
  resolveDeleteArrayValue,
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

const { checkTableExist } = require('../middlewares/tables');

// What was the justification for creating the db instance here again? It looks like it still uses the first instance when you
// start up the server anyways?
const wrapDbInstance = resolverFn => ctx => resolverFn(ctx, sequelize);

// App
router.get('/api/public/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', wrapDbInstance(resolveGetBases));
router.post('/api/base', resolveCreateBase);
router.delete('/api/base/:baseId', resolveDeleteBase);
router.get('/api/base/:baseId', resolveGetBase);

//Table
router.get('/api/tables/:baseId', resolveGetTables);
router.get('/api/table/:tableId', resolveGetTable);
router.post('/api/table', resolveCreateTable);
router.delete('/api/table/:tableId', resolveDeleteTable);

//Field
router.post('/api/field', checkTableExist, resolveCreateField);
router.delete('/api/delete-field', resolveDeleteField);
router.post('/api/resize-column', resolveResizeColumn);
router.put('/api/field', resolveUpdateField);

//Record
router.post('/api/record', checkTableExist, resolveCreateRecord);
router.delete('/api/delete-rows', resolveDeleteRecord);

//FieldValue
router.put('/api/primitive-field', resolveCreateOrUpdatePrimitiveField);
router.post('/api/array-field', resolveUpdateArrayTypeByAdding);
router.delete('/api/clear-field-value', resolveClearFieldValue);
router.delete('/api/array-field', resolveDeleteArrayValue);
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

module.exports = router;
