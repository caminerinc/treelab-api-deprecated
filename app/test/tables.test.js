const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);
describe('tables模块', function(done) {
  describe('GET /api/tables/:baseId', function(done) {
    it('not baseId', function(done) {
      chai
        .request('http://localhost:9000')
        .get('/api/tables')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('baseId: bse1jT7ZIHLmjH4', function(done) {
      chai
        .request('http://localhost:9000')
        .get('/api/tables/bse1jT7ZIHLmjH4')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tableSchemas');
          res.body.tableSchemas[0].should.have.property('id');
          res.body.tableSchemas[0].should.have.property('name');
          res.body.tableSchemas[0].should.have.property('columns');
          done();
        });
    });
  });
  describe('GET /api/table/:tableId', function(done) {
    it('not tableId', function(done) {
      chai
        .request('http://localhost:9000')
        .get('/api/table')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('error tableId', function(done) {
      chai
        .request('http://localhost:9000')
        .get('/api/table/1111111')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('tableId: tblNGUPdSs9Va4X5u', function(done) {
      chai
        .request('http://localhost:9000')
        .get('/api/table/tblNGUPdSs9Va4X5u')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tableDatas');
          res.body.tableDatas.should.have.property('id');
          res.body.tableDatas.should.have.property('rowsById');
          res.body.tableDatas.rowsById.should.have.property(
            'recfPInitd1QpZ6aV',
          );
          done();
        });
    });
  });
});
