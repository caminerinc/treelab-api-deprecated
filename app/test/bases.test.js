const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('bases模块', function() {
  let baseId = '';
  describe('create', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/base')
        .send({ name: 'baseForTest' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('primaryTableId');
          baseId = res.body.id;
          done();
        });
    });
    it('err_name_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/base')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('getBases', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/bases')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('getBase', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get(`/api/base/${baseId}`)
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
        .get('/api/base/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
  describe('delete', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .delete(`/api/base/${baseId}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_baseId_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/base/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
});
