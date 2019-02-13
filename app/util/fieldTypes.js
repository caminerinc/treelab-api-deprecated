const fldTypesController = require('../controllers/fieldTypes');

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
    name2Id: {},
    getByName: {},
  };
  const result = await fldTypesController.getAll();
  result.forEach(i => {
    fieldTypesCache.names.push(i.name);
    fieldTypesCache.name2Id[i.name] = i.id;
    fieldTypesCache.getByName[i.name] = i;
  });
  LAST_CACHE_TIME = now;
  return fieldTypesCache;
};

module.exports = {
  getFieldTypes,
};
