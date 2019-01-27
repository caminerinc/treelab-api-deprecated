const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('module模块', function(done) {
  describe('GET /api/modules', function(done) {
    it('normal', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/modules')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('modules');
          done();
        });
    });
  });

  describe('POST /api/module/extraction', function(done) {
    it('normal', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/module/extraction')
        .send({
          url:
            'https://s3.cn-northwest-1.amazonaws.com.cn/sampledata/Extraction+Data+Summary/Aritizia/Buy+Chart/Buy_Chart.xlsx',
          type: 'excel',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('not url', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/module/extraction')
        .send({
          type: 'excel',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it('not type', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/module/extraction')
        .send({
          url:
            'https://s3.cn-northwest-1.amazonaws.com.cn/sampledata/Extraction+Data+Summary/Aritizia/Buy+Chart/Buy_Chart.xlsx',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
