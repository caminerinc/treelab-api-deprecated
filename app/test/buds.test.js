const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('buds模块', function() {
  describe('create', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/bud')
        .send({ appId: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
