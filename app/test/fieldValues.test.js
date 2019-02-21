const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let base = {};
let newRowId = '';
let newTextFieldId = '';
let newArrayFieldId = '';
describe('fieldValues模块', function() {
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
  it('createTextField', function(done) {
    chai
      .request('http://localhost:8000')
      .post('/api/field')
      .send({
        tableId: base.primaryTableId,
        name: 'textFieldForTest',
        type: 'text',
      })
      .end((err, res) => {
        res.should.have.status(200);
        newTextFieldId = res.body.data.id;
        done();
      });
  });
  it('createArrayField', function(done) {
    chai
      .request('http://localhost:8000')
      .post('/api/field')
      .send({
        tableId: base.primaryTableId,
        name: 'multiSelectFieldForTest',
        type: 'multiSelect',
        typeOptions: {
          choices: {
            'edfeb1d0-33e5-11e9-8eed-ebae191064fa': {
              id: 'edfeb1d0-33e5-11e9-8eed-ebae191064fa',
              name: 'sdsd',
              color: 'blue',
            },
          },
          choiceOrder: ['edfeb1d0-33e5-11e9-8eed-ebae191064fa'],
        },
      })
      .end((err, res) => {
        res.should.have.status(200);
        newArrayFieldId = res.body.data.id;
        done();
      });
  });
  describe('updatePrimitiveField', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/primitive-field')
        .send({ recordId: newRowId, fieldId: newTextFieldId, value: '1' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_params_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/primitive-field')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('updateArrayField', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/array-field')
        .send({
          recordId: newRowId,
          fieldId: newArrayFieldId,
          value: 'f1031130-3432-11e9-b3cd-95ab117178a8',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('deleteArrayFieldItem', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .delete('/api/array-field-item')
        .send({
          recordId: newRowId,
          fieldId: newArrayFieldId,
          item: 'f1031130-3432-11e9-b3cd-95ab117178a8',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('clearFieldValue', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .delete('/api/clear-field-value')
        .send({
          recordId: newRowId,
          fieldId: newTextFieldId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
