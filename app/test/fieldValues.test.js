const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const { forEach } = require('lodash');

chai.use(chaiHttp);

function checkResult(callback) {
  chai
    .request('http://localhost:8000')
    .get('/api/table/tblsnmRLfttLmAYQ8')
    .end(callback);
}
describe('fieldValues模块', function(done) {
  const sends = {
    text: {
      recordId: 'rec1db61c8d540400f',
      fieldId: 'fld1e1ce9eefc0401b',
      value: 'cai',
      fieldTypeId: '1',
    },
    number: {
      recordId: 'rec1db61c8d540400f',
      fieldId: 'fld1e1ce8af180400b',
      value: 24,
      fieldTypeId: '2',
    },
    foreignKey: {
      recordId: 'rec1db61c8d540400f',
      fieldId: 'fld1e1cf1f8dc0403b',
      value: {
        foreignRowId: 'recfPInitd1QpZ6aC',
        name: 'ccc',
        foreignColumnId: 'fld1e1cf1f8f80404b',
      },
      fieldTypeId: '3',
    },
    multipleAttachment: {
      recordId: 'rec1db61c8d540400f',
      fieldId: 'fld1e1ced53340402b',
      value: {
        url:
          'https://dl.airtable.com/yP8sUJ2qQ22T0Jl8cBS4_W%20THXU%20SHACKER%20SL%20PO%20-%209.27%20Fit%20rej.pdf',
        fileName: 'W THXU SHACKER SL PO - 9.27 Fit rej.pdf',
        fileType: 'application/pdf',
      },
      fieldTypeId: '4',
    },
  };
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
      it('error fieldTypeId', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/primitive-field')
          .send({
            recordId: 'rec1db61c8d540400f',
            fieldId: 'fld1e1cf1f8dc0403b',
            value: {
              foreignRowId: 'recfPInitd1QpZ6aC',
              name: 'ccc',
              foreignColumnId: 'fld1e1cf1f8f80404b',
            },
            fieldTypeId: '3',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it('error recordId and fieldId', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/primitive-field')
          .send({
            recordId: '1',
            fieldId: '1',
            value: 'test',
            fieldTypeId: '1',
          })
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });
    describe('OK', function(done) {
      it('text', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/primitive-field')
          .send(sends.text)
          .end((err, res) => {
            res.should.have.status(200);
            checkResult((_err, _res) => {
              _res.should.have.status(200);
              _res.body.tableDatas.rowsById[
                sends.text.recordId
              ].cellValuesByColumnId[sends.text.fieldId].should.to.eql(
                sends.text.value,
              );
              done();
            });
          });
      });
      it('number', function(done) {
        chai
          .request('http://localhost:8000')
          .put('/api/primitive-field')
          .send(sends.number)
          .end((err, res) => {
            res.should.have.status(200);
            checkResult((_err, _res) => {
              _res.should.have.status(200);
              _res.body.tableDatas.rowsById[
                sends.number.recordId
              ].cellValuesByColumnId[sends.number.fieldId].should.to.eql(
                sends.number.value,
              );
              done();
            });
          });
      });
    });
  });
  describe('POST /api/array-field', function(done) {
    describe('ERROR', function(done) {
      it('Missing parameters', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('error fieldTypeId', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send({
            recordId: 'rec1db61c8d540400f',
            fieldId: 'fld1e1ce9eefc0401b',
            value: 'cai',
            fieldTypeId: '1',
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    describe('OK', function(done) {
      it('foreignKey', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send(sends.foreignKey)
          .end((err, res) => {
            res.should.have.status(200);
            checkResult((_err, _res) => {
              _res.should.have.status(200);
              _res.body.tableDatas.rowsById[
                sends.foreignKey.recordId
              ].cellValuesByColumnId[sends.foreignKey.fieldId][0].should.to.eql(
                sends.foreignKey.value.foreignRowId,
              );
              done();
            });
          });
      });
      it('multipleAttachment', function(done) {
        chai
          .request('http://localhost:8000')
          .post('/api/array-field')
          .send(sends.multipleAttachment)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('id');
            res.body.should.have.property('fieldValueId');
            checkResult((_err, _res) => {
              _res.should.have.status(200);
              _res.body.tableDatas.rowsById[
                sends.multipleAttachment.recordId
              ].cellValuesByColumnId[
                sends.multipleAttachment.fieldId
              ][0].should.to.eql({
                id: res.body.id,
                fieldValueId: res.body.fieldValueId,
                ...sends.multipleAttachment.value,
              });
              done();
            });
          });
      });
    });
  });
  describe('DELETE /api/clear-field-value', function(done) {
    describe('ERROR', function(done) {
      it('Missing parameters', function(done) {
        chai
          .request('http://localhost:8000')
          .delete('/api/clear-field-value')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
    });
    describe('OK', function(done) {
      forEach(sends, function(value, key) {
        it(key, function(done) {
          chai
            .request('http://localhost:8000')
            .delete('/api/clear-field-value')
            .send({
              recordId: value.recordId,
              fieldId: value.fieldId,
            })
            .end((err, res) => {
              res.should.have.status(200);
              checkResult((_err, _res) => {
                _res.should.have.status(200);
                _res.body.tableDatas.rowsById[
                  value.recordId
                ].cellValuesByColumnId.should.not.have.property(value.fieldId);
                done();
              });
            });
        });
      });
    });
  });
});