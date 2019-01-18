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
describe('fields模块', function(done) {
  let textId, foreignKeyId;
  describe('POST /api/field', function(done) {
    describe('ERROR', function(done) {
      it('not tableId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/field')
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
          .post('/api/field')
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
          .post('/api/field')
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
          .post('/api/field')
          .send({
            tableId: 'tblNGUPdSs9Va4X5u',
            name: 'address',
            fieldTypeId: '1',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('fieldId');
            textId = res.body.fieldId;
            checkNewField(res.body, done);
          });
      });
      it('number', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/field')
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
          .post('/api/field')
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
            foreignKeyId = res.body.foreignFieldId;
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

  describe('PUT /api/field', function(done) {
    describe('ERROR', function(done) {
      it('Missing parameters', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/field')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('error fieldId', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/field')
          .send({
            fieldId: '1111111111',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it('error fieldTypeId', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/field')
          .send({
            fieldId: 'fldnQ4OWns9ZF88nC',
            fieldTypeId: '5',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    describe('OK', function(done) {
      it('text --> foreignKey', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/field')
          .send({
            fieldId: textId,
            name: 'test',
            fieldTypeId: '3',
            typeOptions: {
              relationship: 'test one',
              foreignTableId: 'tblsnmRLfttLmAYQ8',
            },
          })
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.should.have.property('foreignFieldId');
            // res.body.should.have.property('symmetricFieldId');
            checkForeignField(res.body, done);
          });
      });
      it('foreignKey --> text', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/field')
          .send({
            fieldId: foreignKeyId,
            name: 'test text',
            fieldTypeId: '1',
          })
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.should.have.property('fieldId');
            checkNewField(res.body, done);
          });
      });
    });
  });
  describe('DELETE /api/delete-field', function(done) {
    describe('ERROR', function(done) {
      it('not fieldId', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('error fieldId', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({
            fieldId: '11111111',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    describe('OK', function(done) {
      it('txt fieldId: fldnQ4OWns9ZF88nC', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({
            fieldId: 'fldnQ4OWns9ZF88nC',
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it('number fieldId: fld6tojhqApRQfJpd', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({
            fieldId: 'fld6tojhqApRQfJpd',
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it('foreignKey fieldId: fld6tojhqApRQfJpi', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({
            fieldId: 'fld6tojhqApRQfJpi',
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it('multipleAttachment fieldId: fldIwYLcbYWSUa4aK', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/delete-field')
          .send({
            fieldId: 'fldIwYLcbYWSUa4aK',
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it('get tables', function(done) {
        chai
          .request('http://localhost:8000')
          .get('/api/tables/bse1jT7ZIHLmjH4')
          .end((err, res) => {
            res.should.have.status(200);
            let columns = res.body.tableSchemas[0].columns;
            let txt = findIndex(columns, function(o) {
              return o.id == 'fldnQ4OWns9ZF88nC';
            });
            let number = findIndex(columns, function(o) {
              return o.id == 'fld6tojhqApRQfJpd';
            });
            let foreignKey = findIndex(columns, function(o) {
              return o.id == 'fld6tojhqApRQfJpi';
            });
            let multipleAttachment = findIndex(columns, function(o) {
              return o.id == 'fldIwYLcbYWSUa4aK';
            });
            let symmetricField = findIndex(
              res.body.tableSchemas[1].columns,
              function(o) {
                return o.id == 'fld6tojhqApRQfJ2d';
              },
            );
            expect(txt, 'error txt').to.eql(-1);
            expect(number, 'error number').to.eql(-1);
            expect(foreignKey, 'error foreignKey').to.eql(-1);
            expect(multipleAttachment, 'error multipleAttachment').to.eql(-1);
            expect(symmetricField, 'error symmetricField').to.eql(-1);
            done();
          });
      });
    });
  });
});
