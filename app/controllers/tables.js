const tblQueries = require('../queries/tables');
const posController = require('../controllers/positions');
const recController = require('../controllers/records');
const fldController = require('../controllers/fields');
const fldValController = require('../controllers/fieldValues');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');
const { checkKeyExists, trim } = require('../util/helper');
const { checkType } = require('../util/fieldTypes');

const checkTable = async id => {
  const table = await tblQueries.getEasyTable(id);
  if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);
  return table;
};

const checkNameWithinBase = async (baseId, name) => {
  const bseController = require('../controllers/bases');
  await bseController.getOne(baseId);
  const table = await tblQueries.getTableByBaseAndName(baseId, name);
  if (table) error(Status.Forbidden, ECodes.TABLE_NAME_EXIST);
};

module.exports = {
  checkTable,
  async createNewTableSet(params) {
    await checkNameWithinBase(params.baseId, params.name);

    const table = await tblQueries.create(params);

    await posController.create({
      parentId: params.baseId,
      siblingId: table.id,
      type: POSITION_TYPE.TABLE,
    });
    // TODO: try bulk creating
    let nameField = await fldController.create({
      tableId: table.id,
      name: 'Name',
      type: 'text',
    });

    let descField = await fldController.create({
      tableId: table.id,
      name: 'Description',
      type: 'text',
    });

    let recordResults = [];
    for (let i = 0; i < 3; i++) {
      // TODO: Put this inside a bulk create
      recordResults.push(await recController.create(table.id));
    }

    return {
      table,
      fields: [nameField, descField],
      records: recordResults,
    };
  },
  async getAll(baseId) {
    // @TODO Putting this require at the top doesn't work
    const bseCtrl = require('../controllers/bases');
    await bseCtrl.getOne(baseId);
    return tblQueries.getAllByBaseId(baseId);
  },

  async getOne(id) {
    await checkTable(id);
    return tblQueries.getOneById(id);
  },

  async getShallowRows(id) {
    await checkTable(id);
    const table = await tblQueries.getOneById(id);
    const tableSchema = await tblQueries.getTableSchema(id);

    return { table, tableSchema };
  },

  getEasyTable(id) {
    return tblQueries.getEasyTable(id);
  },

  async delete(id) {
    await checkTable(id);
    await tblQueries.destroy(id);
  },

  async update(params) {
    const table = await checkTable(params.tableId);
    if (params.name.toLowerCase() === table.name.toLowerCase()) return null;
    await checkNameWithinBase(table.baseId, params.name);
    return await tblQueries.update(params);
  },

  async bulkTables(baseId, tables) {
    let tblRecords = [];
    let fldRecords = [];
    let recRecords = [];
    let fldValRecords = [];
    for (const table of tables) {
      checkKeyExists(table, 'name', 'rows', 'fields');
      table.name = trim(table.name);
      if (table.name === '') error(null, ECodes.TABLE_NAME_EMPTY);
      await checkNameWithinBase(baseId, table.name);
      tblRecords.push({ baseId, name: table.name });
      const tableNum = tblRecords.length;
      fldRecords[tableNum - 1] = [];
      recRecords[tableNum - 1] = [];
      for (const field of table.fields) {
        checkKeyExists(field, 'name', 'type', 'typeOptions', 'values');
        field.name = trim(field.name);
        if (field.name === '') error(null, ECodes.FIELD_NAME_EMPTY);
        fldRecords[tableNum - 1].push({
          name: field.name,
          fieldTypeId: await checkType(field.type),
          typeOptions: field.typeOptions,
        });
        for (const value of field.values) {
          fldValRecords.push({
            recordId: null,
            fieldId: null,
            value,
            valuesNum: field.values.length,
          });
        }
      }
      for (let i = 0; i < table.rows; i++) {
        recRecords[tableNum - 1].push({});
      }
    }

    const tblResults = await tblQueries.bulkCreate(tblRecords);
    for (let i = 0; i < tblResults.length; i++) {
      for (let j = 0; j < fldRecords[i].length; j++) {
        fldRecords[i][j].tableId = tblResults[i].id;
        await fldController.checkFieldByTableAndName(
          tblResults[i].id,
          fldRecords[i][j].name,
        );
      }
      for (let j = 0; j < recRecords[i].length; j++) {
        recRecords[i][j].tableId = tblResults[i].id;
      }
    }

    const recResult = await recController.bulkCreate(
      recRecords.reduce((a, item) => {
        return a.concat(item);
      }),
    );

    const fldResult = await fldController.bulkCreate(
      fldRecords.reduce((a, item) => {
        return a.concat(item);
      }),
    );

    let k = 0;
    for (let i = 0; i < fldResult.length; i++) {
      let index = 0;
      let valuesNum = fldValRecords[k] ? fldValRecords[k].valuesNum : 0;
      for (let j = k; j < fldValRecords.length; j++) {
        if (index < valuesNum) {
          fldValRecords[j].recordId = recResult[index].id;
          fldValRecords[j].fieldId = fldResult[i].id;
          index++;
          k++;
        } else {
          valuesNum = fldValRecords[j];
          break;
        }
      }
    }
    return await fldValController.bulkCreate(fldValRecords);
  },
};
