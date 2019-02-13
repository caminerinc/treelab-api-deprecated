const fltController = require('../controllers/fieldTypes');

const CACHE_TIME = 5 * 60 * 1000; //ms
let LAST_CACHE_TIME = 0;
let fieldTypesCache = null;

const getFieldTypes = async () => {
  if (fieldTypesCache && Date.now() - LAST_CACHE_TIME < CACHE_TIME) {
    return fieldTypesCache;
  }
  fieldTypesCache = {
    names: [],
    id2Name: {},
    name2Id: {},
  };
  const result = await fltController.getAll();
  result.forEach(i => {
    fieldTypesCache.names.push(i.name);
    fieldTypesCache.id2Name[i.id] = i.name;
    fieldTypesCache.name2Id[i.name] = i.id;
  });
  LAST_CACHE_TIME = Date.now();
  return fieldTypesCache;
};

module.exports = {
  getFieldTypes,
};
