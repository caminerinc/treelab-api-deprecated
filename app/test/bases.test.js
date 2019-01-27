const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const { findIndex } = require('lodash');

chai.use(chaiHttp);
describe('bases模块', function(done) {
  describe('delete /api/base/:baseId', function(done) {
    describe('ERROR', function(done) {
      it('not baseId', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/base')
          .end((err, res) => {
            res.should.have.status(405);
            done();
          });
      });
    });

    describe('OK', function(done) {
      it('baseId: bse1jT7ZIDLmjH5', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/base/bse1jT7ZIDLmjH5')
          .end((err, res) => {
            res.should.have.status(200);

            chai
              .request('http://localhost:8000')
              .get('/api/bases')
              .end((_err, _res) => {
                _res.should.have.status(200);

                let base = findIndex(_res.body.bases, function(o) {
                  return o.id == 'bse1jT7ZIDLmjH5';
                });
                expect(base).to.eql(-1);

                chai
                  .request('http://localhost:8000')
                  .get('/api/tables/bse1jT7ZIDLmjH5')
                  .end((tableErr, tableRes) => {
                    tableRes.should.have.status(200);
                    tableRes.body.tableSchemas.length.should.be.eql(0);
                    done();
                  });
              });
          });
      });
    });
  });

  describe('get /api/base/:baseId', function(done) {
    it('not baseId', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/base/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
    it('not base', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/base/bse1jT7ZIDLmjH1')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('OK', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/base/bse1jT7ZIHLmjH4')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
