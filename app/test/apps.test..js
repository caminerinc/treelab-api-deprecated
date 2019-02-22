const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('apps模块', function() {
  describe('getApps', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/apps')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
