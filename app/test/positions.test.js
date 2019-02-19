/* 
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let base = {};
describe('positions模块', function() {
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
  describe('changePosition', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send({
          type: 'table',
          targetPosition: 1,
          parentId: base.primaryTableId,
          originalPositions: [1],
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_params_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
 */
