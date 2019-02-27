const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('buds模块', function() {
  let budId = '';
  let base = {};
  let newRowId = '';
  let newFieldId = '';
  describe('create', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/bud')
        .send({ appId: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          budId = res.body.budId;
          done();
        });
    });
  });
  describe('getBud', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get(`/api/bud/${budId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          done();
        });
    });
    it('err_baseId_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/bud/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
  describe('executeBud', function() {
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
    it('createRecord', function(done) {
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
    it('createProgressField', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'progressFieldForTest',
          type: 'progress',
        })
        .end((err, res) => {
          res.should.have.status(200);
          newTextFieldId = res.body.data.id;
          done();
        });
    });
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/execute-bud')
        .send({
          action: 'data-extraction',
          data: {
            Progress: {
              recordId: newRowId,
              fieldId: newFieldId,
              baseId: base.id,
            },
            function_type: 'table_function',
            url:
              'https://platform-files.s3.cn-north-1.amazonaws.com.cn/tests-example.xls',
            engine_type: null,
            location: '',
            file_type: 'excel',
            page_nums: '[1,2,3]',
            key: "['xxs']",
            service_type: 'complete_match',
          },
        })
        .end((err, res) => {
          res.should.have.status(200);
          budId = res.body.budId;
          done();
        });
    });
  });
});
