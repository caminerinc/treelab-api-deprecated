const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('buds模块', function() {
  let budId = '';
  describe('create', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/bud')
        .send({ appId: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          budId = res.body.budId;
          done();
        });
    });
  });
  describe('getBud', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get(`/api/bud/${budId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          done();
        });
    });
    it('err_baseId_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/bud/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
});
