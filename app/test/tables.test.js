const assert = require('power-assert');
const request = require('request');

describe('tables模块', function(done) {
  describe('#/api/tables/', function(done) {
    it('GetTables', function(done) {
      request.get('http://127.0.0.1:9000/api/tables/bse1jT7ZIHLmjH4', function(
        err,
        res,
      ) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
});
