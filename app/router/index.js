const Router = require('koa-router');
const router = new Router();

// const {
//   resolveGetBases,
//   resolveCreateBase,
//   resolveDeleteBase,
//   resolveGetBase,
// } = require('../resolvers/bases');
const bseResolver = require('../resolvers/bases');
// const {
//   resolveGetTables,
//   resolveGetTable,
//   resolveCreateTable,
//   resolveDeleteTable,
//   resolveGetRowsMatchingName,
// } = require('../resolvers/tables');
const tblResolver = require('../resolvers/tables');
// const {
//   resolveCreateField,
//   resolveDeleteField,
//   resolveResizeColumn,
//   resolveUpdateField,
// } = require('../resolvers/fields');
// const {
//   resolveCreateOrUpdatePrimitiveField,
//   resolveUpdateArrayTypeByAdding,
//   resolveClearFieldValue,
//   resolveDeleteArrayValue,
//   resolveBulkCopyFieldValue,
// } = require('../resolvers/fieldValues');
// const {
//   resolveCreateRecord,
//   resolveDeleteRecord,
// } = require('../resolvers/records');
// const {
//   resolveGetUsers,
//   resolveCreateUser,
//   resolveLogin,
//   resolveTestAuth,
// } = require('../resolvers/users');
const usrResolver = require('../resolvers/users');
// const { resolveChangePosition } = require('../resolvers/positions');
// const { resolveGetPouches, resolveGetPouch } = require('../resolvers/pouches');
// const {
//   resolveGetModules,
//   resolveExtraction,
// } = require('../resolvers/modules');

// const { checkTableExist } = require('../middlewares/tables');
// const { checkBaseExist } = require('../middlewares/bases');

// // App
// router.get('/api/public/health-check', ctx => {
//   ctx.body = 'Connection established';
// });

// Base
router.get('/api/bases', bseResolver.getAll);
router.post('/api/base', bseResolver.create);
// router.delete('/api/base/:baseId', checkBaseExist, resolveDeleteBase);
router.get('/api/base/:baseId', bseResolver.getOne);

// Table
router.get('/api/tables/:baseId', tblResolver.getAll);
// router.get('/api/table/:tableId', resolveGetTable);
// router.post('/api/table', checkBaseExist, resolveCreateTable);
// router.delete('/api/table/:tableId', checkTableExist, resolveDeleteTable);
// router.get(
//   '/api/table/:tableId/getRowsMatchingName',
//   checkTableExist,
//   resolveGetRowsMatchingName,
// );

// //Field
// router.post('/api/field', checkTableExist, resolveCreateField);
// router.delete('/api/delete-field', resolveDeleteField);
// router.post('/api/resize-column', resolveResizeColumn);
// router.put('/api/field', resolveUpdateField);

// //Record
// router.post('/api/record', checkTableExist, resolveCreateRecord);
// router.delete('/api/delete-rows', resolveDeleteRecord);

// //FieldValue
// router.put('/api/primitive-field', resolveCreateOrUpdatePrimitiveField);
// router.post('/api/array-field', resolveUpdateArrayTypeByAdding);
// router.delete('/api/clear-field-value', resolveClearFieldValue);
// router.delete('/api/array-field', resolveDeleteArrayValue);
// router.post('/api/bulk-copy-field-value', resolveBulkCopyFieldValue);

// //Position
// router.put('/api/change-position', resolveChangePosition);

// //Pouch
// router.get('/api/pouches', resolveGetPouches);
// router.get('/api/pouch/:pouchId', resolveGetPouch);

// //Module
// router.get('/api/modules', resolveGetModules);
// router.post('/api/module/extraction', resolveExtraction);

//Users
router.get('/api/users', usrResolver.getAll);
router.post('/api/public/user', usrResolver.create);
router.post('/api/public/login', usrResolver.login);
router.get('/api/public/test-auth', usrResolver.testAuth);

module.exports = router;
