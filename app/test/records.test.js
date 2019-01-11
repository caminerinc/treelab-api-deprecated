const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

function checkNewRecord(callback) {
  chai
    .request('http://localhost:8000')
    .get('/api/table/tblNGUPdSs9Va4X5u')
    .end(callback);
}
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

    describe('OK', function(done) {
      it('tableId: tblNGUPdSs9Va4X5u', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/record')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('recordId');
            checkNewRecord((_err, _res) => {
              _res.should.have.status(200);
              _res.body.tableDatas.rowsById.should.have.property(
                res.body.recordId,
              );
              done();
            });
          });
      });
    });
  });
  describe('DELETE /api/delete-rows', function(done) {
    it('rows: [recwEKHeMhcDnLnfc]', function(done) {
      let rows = ['recwEKHeMhcDnLnfc'];
      chai
        .request('http://localhost:8000')
        .delete('/api/delete-rows')
        .send({
          rows,
        })
        .end((err, res) => {
          res.should.have.status(200);

          checkNewRecord(function(_err, _res) {
            _res.should.have.status(200);
            for (let i = 0; i < rows.length; i++) {
              _res.body.tableDatas.rowsById.should.not.have.property(rows[i]);
            }
            done();
          });
        });
    });
  });
});
