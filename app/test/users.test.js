const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let testUserEmail = Date.now() + '@test.com';
describe('users模块', function() {
  describe('create', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          password: 'test',
          email: testUserEmail,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_illegal_email', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: 'test',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('err_password_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: testUserEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('err_email_exists', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          password: 'test',
          email: 'jon@caminer.io',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('getAllUsers', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
  describe('login', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: testUserEmail,
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });
    it('err_wrong_email', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: 'test',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });
    it('err_authenticate_failed', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: testUserEmail,
          password: 'testtest',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
