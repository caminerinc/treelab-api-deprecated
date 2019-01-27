const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);
describe('users模块', function(done) {
  describe('GET /api/users', function(done) {
    it('users', function(done) {
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

  describe('POST /api/public/user', function(done) {
    it('createUser', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          password: 'test',
          email: 'test@test.com',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('illegal email', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: 'test@test',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it('not password', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/user')
        .send({
          firstName: 'test',
          lastName: 'test',
          email: 'test@test.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it('email exists', function(done) {
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
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /api/public/login', function(done) {
    it('login', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });
    it('wrong email', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: 'test@test',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });
    it('authenticate failed', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/login')
        .send({
          email: 'test@test.com',
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
