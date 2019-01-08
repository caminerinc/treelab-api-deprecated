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
});
