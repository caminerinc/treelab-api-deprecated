const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('fieldValues模块', function(done) {
  describe('PUT /api/primitive-field', function(done) {
    describe('ERROR', function(done) {
      it('Missing parameters', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/primitive-field')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
    });
    describe('OK', function(done) {});
  });
  describe('POST /api/array-field', function(done) {
    describe('ERROR', function(done) {});
    describe('OK', function(done) {});
  });
  describe('DELETE /api/clear-field-value', function(done) {
    describe('ERROR', function(done) {});
    describe('OK', function(done) {});
  });
});
