const rp = require('request-promise');
const socketIo = require('../../lib/socketIo');
const fldValController = require('../controllers/fieldValues');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

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

    try {
      await rp({
        uri: BUDS_MAPPING[params.action],
        method: 'POST',
        form: { data: params.data },
        json: true,
      });

      // ------------------
      if (progressInfo) {
        const completeUpdate = {
          ...progressInfo,
          value: 'Complete',
        };
        fldValController.upsertPrimitive(completeUpdate);
        socketIo.sync({
          op: 'updateProgress',
          body: completeUpdate,
        });
      }
      // ------------------
    } catch (e) {
      // -------------------
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
      // ---------------------
    }
  },
};
