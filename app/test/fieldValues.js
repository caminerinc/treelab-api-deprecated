const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const { findIndex } = require('lodash');
chai.use(chaiHttp);

function checkNewField(params, done) {
  chai
    .request('http://localhost:8000')
    .get('/api/tables/bse1jT7ZIHLmjH4')
    .end((err, res) => {
      res.should.have.status(200);

      let columns = res.body.tableSchemas[0].columns;
      const field = findIndex(columns, function(o) {
        return o.id == params.fieldId;
      });
      field.should.be.not.eql(-1);
      done();
    });
}
function checkForeignField(params, done) {
  chai
    .request('http://localhost:8000')
    .get('/api/tables/bse1jT7ZIHLmjH4')
    .end((err, res) => {
      res.should.have.status(200);

      let foreignColumns = res.body.tableSchemas[0].columns;
      let symmetricColumns = res.body.tableSchemas[1].columns;
      const foreignField = findIndex(foreignColumns, function(o) {
        return o.id == params.foreignFieldId;
      });
      const symmetricField = findIndex(symmetricColumns, function(o) {
        return o.id == params.symmetricFieldId;
      });
      foreignField.should.be.not.eql(-1);
      symmetricField.should.be.not.eql(-1);
      done();
    });
}
describe('fieldValues模块', function(done) {
  describe('DELETE /api/array-field', function(done) {
    describe('ERROR', function(done) {
      it('not tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            name: 'age',
            fieldTypeId: '2',
            typeOptions: {
              format: 'decimal',
              precision: 1,
              negative: false,
            },
          })
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('error tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            tableId: '111111111',
            name: 'age',
            fieldTypeId: '2',
            typeOptions: {
              format: 'decimal',
              precision: 1,
              negative: false,
            },
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it('error fieldTypeId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'age',
            fieldTypeId: '5',
            typeOptions: {
              format: 'decimal',
              precision: 1,
              negative: false,
            },
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it('error typeOptions', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'age',
            fieldTypeId: '2',
            typeOptions: {
              precision: 1,
              negative: false,
            },
          })
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
    });

    describe('OK', function(done) {
      it('text', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'address',
            fieldTypeId: '1',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('fieldId');
            checkNewField(res.body, done);
          });
      });
      it('number', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'age',
            fieldTypeId: '2',
            typeOptions: {
              format: 'decimal',
              precision: 1,
              negative: false,
            },
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('fieldId');
            checkNewField(res.body, done);
          });
      });
      it('foreignKey', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: '测试',
            fieldTypeId: '3',
            typeOptions: {
              relationship: 'many',
              foreignTableId: 'tblsnmRLfttLmAYQ8',
            },
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('foreignFieldId');
            res.body.should.have.property('symmetricFieldId');
            checkForeignField(res.body, done);
          });
      });
      it('multipleAttachment', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'contract',
            fieldTypeId: '4',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('fieldId');
            checkNewField(res.body, done);
          });
      });
    });
  });
});
