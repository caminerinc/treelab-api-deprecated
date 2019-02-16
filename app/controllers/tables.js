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
  if (table) error(Status.Forbidden, ECodes.TABLE_NAME_EXIST, name);
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
    let tblPosRecords = [];
    let recPosRecords = [];
    let fldPosRecords = [];
    let tblFvFlag = [];
    for (const table of tables) {
      checkKeyExists(table, 'name', 'fields');
      table.name = trim(table.name);
      if (table.name === '') error(null, ECodes.TABLE_NAME_EMPTY);
      await checkNameWithinBase(baseId, table.name);
      tblRecords.push({ baseId, name: table.name });
      const tableNum = tblRecords.length;
      fldRecords[tableNum - 1] = [];
      recRecords[tableNum - 1] = [];
      let tblRows = 0;
      let tblFvNum = 0;
      for (const field of table.fields) {
        checkKeyExists(field, 'name', 'type', 'typeOptions', 'values');
        field.name = trim(field.name);
        if (field.name === '') error(null, ECodes.FIELD_NAME_EMPTY);
        fldRecords[tableNum - 1].push({
          name: field.name,
          fieldTypeId: await checkType(field.type),
          typeOptions: field.typeOptions,
        });
        const fvLen = field.values.length;
        tblFvNum += fvLen;
        tblRows = fvLen > tblRows ? fvLen - tblRows : 0;
        for (let i = 0; i < tblRows; i++) {
          recRecords[tableNum - 1].push({});
        }
        for (const value of field.values) {
          fldValRecords.push({
            recordId: null,
            fieldId: null,
            value,
            valuesNum: fvLen,
          });
        }
        if (fvLen === 0) {
          fldValRecords.push({
            recordId: null,
            fieldId: null,
            value: null,
            valuesNum: 0,
          });
        }
      }
      let lastTblFvNum = tblFvFlag[tblFvFlag.length - 1]
        ? tblFvFlag[tblFvFlag.length - 1].tblFvNum
        : 0;
      let lastTblRows = tblFvFlag[tblFvFlag.length - 1]
        ? tblFvFlag[tblFvFlag.length - 1].tblRows
        : 0;
      tblFvFlag.push({
        tblFvNum: lastTblFvNum + tblFvNum,
        tblRows: lastTblRows + recRecords[tableNum - 1].length,
      });
    }
    const tblResults = await tblQueries.bulkCreate(tblRecords);
    const lastTablePos =
      (await posController.getLastPosition(baseId, POSITION_TYPE.TABLE))
        .dataValues.max || 0;
    for (let i = 0; i < tblResults.length; i++) {
      for (let j = 0; j < fldRecords[i].length; j++) {
        fldRecords[i][j].tableId = tblResults[i].id;
        await fldController.checkFieldByTableAndName(
          tblResults[i].id,
          fldRecords[i][j].name,
        );
        fldPosRecords.push({
          parentId: tblResults[i].id,
          siblingId: null,
          position: j + 1,
        });
      }
      for (let j = 0; j < recRecords[i].length; j++) {
        recRecords[i][j].tableId = tblResults[i].id;
        recPosRecords.push({
          parentId: tblResults[i].id,
          siblingId: null,
          position: j + 1,
        });
      }
      tblPosRecords.push({
        parentId: baseId,
        siblingId: tblResults[i].id,
        position: lastTablePos + i + 1,
      });
    }
    await posController.bulkCreate(tblPosRecords, POSITION_TYPE.TABLE);

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

    let fvIndex = 0;
    let lastFlag = tblFvFlag.shift();
    let rowsEnd = lastFlag.tblRows;
    let beginRows = 0;
    for (let i = 0; i < fldResult.length; i++) {
      fldPosRecords[i].siblingId = fldResult[i].id;
      let recIndex = 0;
      let valuesNum = fldValRecords[fvIndex]
        ? fldValRecords[fvIndex].valuesNum
        : 0;
      if (valuesNum === 0) {
        fldValRecords.splice(fvIndex, 1);
        continue;
      }
      for (let j = fvIndex; j < fldValRecords.length; j++) {
        if (fvIndex >= lastFlag.tblFvNum) {
          lastFlag = tblFvFlag.shift();
          if (!lastFlag) break;
          beginRows = rowsEnd;
          rowsEnd = lastFlag.tblRows;
        }
        if (recIndex < valuesNum) {
          fldValRecords[j].recordId = recResult[beginRows + recIndex].id;
          fldValRecords[j].fieldId = fldResult[i].id;
          recIndex++;
          fvIndex++;
        } else {
          valuesNum = fldValRecords[j].valuesNum;
          break;
        }
      }
    }
    recResult.forEach((i, index) => (recPosRecords[index].siblingId = i.id));
    await fldValController.bulkCreate(fldValRecords);
    await posController.bulkCreate(fldPosRecords, POSITION_TYPE.FIELD);
    await posController.bulkCreate(recPosRecords, POSITION_TYPE.RECORD);
    return;
  },
};
