const Router = require('koa-router');
const router = new Router();

const bseResolver = require('../resolvers/bases');
const tblResolver = require('../resolvers/tables');
const fldResolver = require('../resolvers/fields');
const fldValResolver = require('../resolvers/fieldValues');
const recResolver = require('../resolvers/records');
const usrResolver = require('../resolvers/users');
const posResolver = require('../resolvers/positions');

// App
router.get('/api/public/health-check', ctx => {
  ctx.body = 'Connection established';
});

// Base
router.get('/api/bases', bseResolver.getAll);
router.get('/api/base/:baseId', bseResolver.getOne);
router.post('/api/base', bseResolver.create);
router.delete('/api/base/:baseId', bseResolver.delete);

// Table
router.get('/api/tables/:baseId', tblResolver.getAll);
router.get('/api/table/:tableId', tblResolver.getOne);
router.post('/api/table', tblResolver.create);
router.delete('/api/table/:tableId', tblResolver.delete);
router.get('/api/table/:tableId/shallow-rows', tblResolver.getShallowRows);

// //Field
router.post('/api/field', fldResolver.create);
router.put('/api/resize-column', fldResolver.resizeColumn);
router.put('/api/field', fldResolver.update);
router.delete('/api/field/:fieldId', fldResolver.delete);

// //Record
router.post('/api/record', recResolver.create);
router.delete('/api/delete-rows', recResolver.deleteMultiple);

// //FieldValue
router.post('/api/array-field', fldValResolver.updateArrayByAdding);
router.put('/api/primitive-field', fldValResolver.createOrUpdatePrimitive);
router.delete('/api/clear-field-value', fldValResolver.clearValue);
router.delete('/api/array-field', fldValResolver.deleteArrayValue);
// TODO fix bulk copy
// router.post('/api/bulk-copy-field-value', resolveBulkCopyFieldValue);

// //Position
// router.put('/api/change-position', posResolver.changePosition);

//Users
router.get('/api/users', usrResolver.getAll);
router.get('/api/public/test-auth', usrResolver.testAuth);
router.post('/api/public/user', usrResolver.create);
router.post('/api/public/login', usrResolver.login);

module.exports = router;
