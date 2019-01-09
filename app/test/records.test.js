const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);
describe('records模块', function(done) {
  describe('POST /api/record', function(done) {
    describe('ERROR', function(done) {
      it('not tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/record')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('error tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/record')
          .send({
            tableId: '111111111',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    it('tableId: tblNGUPdSs9Va4X5u', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/record')
        .send({
          tableId: 'tblNGUPdSs9Va4X5u',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('DELETE /api/delete-rows', function(done) {
    it('rows: [recwEKHeMhcDnLnfc,recfPInitd1QpZ6aV]', function(done) {
      chai
        .request('http://localhost:8000')
        .delete('/api/delete-rows')
        .send({
          rows: ['recwEKHeMhcDnLnfc', 'recfPInitd1QpZ6aV'],
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
