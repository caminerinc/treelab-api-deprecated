const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('tables模块', function(done) {
  describe('GET /api/tables/:baseId', function(done) {
    describe('ERROR', function(done) {
      it('not baseId', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/tables')
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
      it('error baseId', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/tables/111111111')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.tableSchemas.should.be.a('array');
            res.body.tableSchemas.length.should.be.eql(0);
            done();
          });
      });
    });
    it('baseId: bse1jT7ZIHLmjH4', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/tables/bse1jT7ZIHLmjH4')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tableSchemas');
          res.body.tableSchemas[0].columns.length.should.be.eql(9);
          res.body.tableSchemas[1].columns.length.should.be.eql(2);
          expect(res.body).to.not.equal();
          done();
        });
    });
  });

  describe('GET /api/table/:tableId', function(done) {
    describe('ERROR', function(done) {
      it('not tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/table')
          .end((err, res) => {
            res.should.have.status(405);
            done();
          });
      });
      it('error tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/table/1111111')
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    it('tableId: tblNGUPdSs9Va4X5u', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table/tblNGUPdSs9Va4X5u')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.viewDatas[0].rowOrder.length.should.be.eql(1);
          done();
        });
    });
  });
});
