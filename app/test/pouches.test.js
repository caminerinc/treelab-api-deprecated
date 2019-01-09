const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('pouches模块', function(done) {
  describe('GET /api/pouches', function(done) {
    it('normal', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/pouches')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pouches');
          done();
        });
    });
  });

  describe('GET /api/pouch:pouchId', function(done) {
    it('normal', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/pouch/pch12984y9128')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('params error', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/pouch')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
