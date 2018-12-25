const tablesController = require('../controllers').tables;

const CACHE_TIME = 6000; //ms
let LAST_CACHE_TIME = 0;
let fieldTypes = null;

const getFieldTypes = async () => {
  if (fieldTypes && Date.now() - LAST_CACHE_TIME < CACHE_TIME) {
    return fieldTypes;
  }
  const result = await tablesController.findFieldTypes();
  fieldTypes = {
    types: Array.from(result, i => i.name),
    idNameMapping: result.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {}),
    nameIdMapping: result.reduce((obj, item) => {
      obj[item.name] = item.id;
      return obj;
    }, {}),
  };
  LAST_CACHE_TIME = Date.now();
  return fieldTypes;
};

module.exports = {
  getFieldTypes,
};
