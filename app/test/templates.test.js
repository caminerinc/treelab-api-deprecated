const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('templates模块', function() {
  describe('generate', function() {
    it.only('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/create-base-with-template')
        .send({ templateId: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          done();
        });
    });
  });
});
