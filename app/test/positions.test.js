const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);
describe('positions模块', function(done) {
  describe('/api/change-position', function(done) {
    it('changePosition', function(done) {
      const params = {
        type: 'record',
        targetPosition: 2,
        parentId: 'tblNGUPdSs9Va4X5u',
        originalPositions: [1, 4],
      };
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send(params)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('empty originalPositions', function(done) {
      const params = {
        type: 'record',
        targetPosition: 2,
        parentId: 'tblNGUPdSs9Va4X5u',
        originalPositions: [],
      };
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send(params)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('not parentId', function(done) {
      const params = {
        type: 'record',
        targetPosition: 2,
        originalPositions: [],
      };
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send(params)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('not targetPosition', function(done) {
      const params = {
        type: 'record',
        parentId: 'tblNGUPdSs9Va4X5u',
        originalPositions: [1, 3],
      };
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send(params)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('not type', function(done) {
      const params = {
        targetPosition: 2,
        parentId: 'tblNGUPdSs9Va4X5u',
        originalPositions: [1, 4],
      };
      chai
        .request('http://localhost:8000')
        .put('/api/change-position')
        .send(params)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
});
