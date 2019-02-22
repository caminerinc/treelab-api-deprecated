const rp = require('request-promise');
const socketIo = require('../../lib/socketIo');
const fldValController = require('../controllers/fieldValues');
// TODO: @Derek remove the import of resolver table from here
const tblController = require('../controllers/tables');
const budsController = require('../controllers/buds');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const { url } = require('../../config/config');

const BUDS_MAPPING = {
  'data-extraction': url.attachmentExtraction,
};

module.exports = {
  async executeBud(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'action', 'data');
    if (!BUDS_MAPPING[params.action])
      error(Status.Forbidden, ECodes.BUD_NOT_FOUND, params.action);

    // TODO: @Derek Progress code is temporary
    // --------------
    const progressInfo = params.data && params.data.Progress;
    if (!progressInfo) {
      error(Status.Forbidden, ECodes.BUD_DATA_MISSING);
    }
    if (progressInfo) {
      const inProgressUpdate = { ...progressInfo, value: 'In Progress' };
      fldValController.upsertPrimitive(inProgressUpdate);
      socketIo.sync({
        op: 'updateProgress',
        body: inProgressUpdate,
      });
    }
    // ------------------
    ctx.body = { message: 'Module request sent' };
    console.log('Package to python -- ', params.data);
    try {
      const result = await rp({
        uri: BUDS_MAPPING[params.action],
        method: 'POST',
        form: { ...params.data },
        json: true,
      });
      console.log('Response received -- ', result);

      if (progressInfo) {
        try {
          const baseId = progressInfo.baseId;
          const createdTables = await sequelize.transaction(() =>
            tblController.bulkTables(baseId, result),
          );
          socketIo.sync({
            op: 'createMultipleTables',
            body: createdTables,
          });

          console.log('what are the created Tables', createdTables);
          const completeUpdate = {
            ...progressInfo,
            value: 'Complete',
          };
          fldValController.upsertPrimitive(completeUpdate);
          socketIo.sync({
            op: 'updateProgress',
            body: completeUpdate,
          });
        } catch (e) {
          console.log('Error in creating tables!');

          if (progressInfo) {
            const errorUpdate = {
              ...progressInfo,
              value: 'Error',
            };
            fldValController.upsertPrimitive(errorUpdate);
            socketIo.sync({
              op: 'updateProgress',
              body: errorUpdate,
            });
          }
        }
      }
    } catch (e) {
      console.log('Error occured -- ', e);
      if (progressInfo) {
        const errorUpdate = {
          ...progressInfo,
          value: 'Error',
        };
        fldValController.upsertPrimitive(errorUpdate);
        socketIo.sync({
          op: 'updateProgress',
          body: errorUpdate,
        });
      }
    }
  },

  async createBud(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'appId');
    await sequelize.transaction(() => budsController.generate(params.appId));
    ctx.body = { message: 'success' };
  },
};
