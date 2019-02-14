const fldTypesController = require('../controllers/fieldTypes');
const { error, Status, ECodes } = require('./error');

const CACHE_TIME = 5 * 60 * 1000; //ms
let LAST_CACHE_TIME = 0;
let fieldTypesCache = null;

const getFieldTypes = async () => {
  const now = Date.now();
  if (fieldTypesCache && now - LAST_CACHE_TIME < CACHE_TIME) {
    return fieldTypesCache;
  }
  fieldTypesCache = {
    names: [],
    nameToId: {},
    getByName: {},
  };
  const result = await fldTypesController.getAll();
  result.forEach(i => {
    fieldTypesCache.names.push(i.name);
    fieldTypesCache.nameToId[i.name] = i.id;
    fieldTypesCache.getByName[i.name] = i;
  });
  LAST_CACHE_TIME = now;
  return fieldTypesCache;
};

const checkField = async fieldId => {
  const fldController = require('../controllers/fields');
  const field = await fldController.getById(fieldId);
  if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);
  if (!field.types) error(Status.Forbidden, ECodes.UNSUPPORTED_FIELD_TYPE);
  return field;
};

const checkType = async type => {
  const fieldTypes = await getFieldTypes();
  if (!fieldTypes.nameToId[type])
    error(Status.Forbidden, ECodes.UNSUPPORTED_FIELD_TYPE);
  return fieldTypes.nameToId[type];
};

module.exports = {
  getFieldTypes,
  checkField,
  checkType,
};
