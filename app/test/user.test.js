const assert = require('power-assert');
const request = require('request');

describe('user模块', function(done) {
  describe('#resolveGetUsers()', function(done) {
    it('/api/users', function(done) {
      request.get('http://127.0.0.1:9000/api/users', function(err, res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
});
