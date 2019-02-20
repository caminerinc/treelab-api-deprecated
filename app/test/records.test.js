const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let base = {};
let newRowId = '';
describe('records模块', function(done) {
  it('createBase', function(done) {
    chai
      .request('http://localhost:8000')
      .post('/api/base')
      .send({ name: 'baseForTest' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('primaryTableId');
        base = res.body;
        done();
      });
  });
  describe('create', function(done) {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/record')
        .send({
          tableId: base.primaryTableId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('recordId');
          newRowId = res.body.recordId;
          done();
        });
    });
    it('err_tableId_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/record')
        .send({})
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
  describe('delete', function(done) {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .delete('/api/delete-rows')
        .send({ rows: [newRowId] })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
