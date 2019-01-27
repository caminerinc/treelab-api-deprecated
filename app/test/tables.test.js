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

    describe('OK', function(done) {
      it('baseId: bse1jT7ZIHLmjH4', function(done) {
        chai
          .request('http://localhost:8000')
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
            res.should.have.status(403);
            done();
          });
      });
    });
    describe('OK', function(done) {
      it('tableId: tblNGUPdSs9Va4X5u', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/table/tblNGUPdSs9Va4X5u')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

  describe('delete /api/table/:tableId', function(done) {
    describe('ERROR', function(done) {
      it('not baseId', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/table')
          .end((err, res) => {
            res.should.have.status(405);
            done();
          });
      });
    });

    describe('OK', function(done) {
      it('tableId: tblNGUPdSs9Va4X5u', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/table/tblNGUPdSs9Va4X5u')
          .end((err, res) => {
            res.should.have.status(200);

            done();
          });
      });
      it('check: tblNGUPdSs9Va4X5u', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/table/tblNGUPdSs9Va4X5u')
          .end((err, res) => {
            res.should.have.status(403);
            done();
          });
      });
    });
  });

  describe('post /api/table', function(done) {
    it('not baseId', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ name: 'test' })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('not name', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ baseId: 'bse1jT7ZIHLmjH4' })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('base dose not exist', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ baseId: 'test', name: 'test' })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('OK', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ baseId: 'bse1jT7ZIHLmjH4', name: 'testForMocha' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
