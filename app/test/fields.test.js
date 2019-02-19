const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let base = {};
let fieldIdForUpdate = '';
let fieldIdForDelete = '';
describe('fields模块', function() {
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
  describe('create', function() {
    it('ok_text', function(done) {
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
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          fieldIdForUpdate = res.body.id;
          done();
        });
    });
    it('ok_number', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'numberFieldForTest',
          type: 'number',
          typeOptions: {
            precision: 1,
          },
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          fieldIdForDelete = res.body.id;
          done();
        });
    });
    it('ok_multilineText', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'multilineTextFieldForTest',
          type: 'multilineText',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_multiSelect', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'multiSelectFieldForTest',
          type: 'multiSelect',
          typeOptions: {
            choiceOrder: ['ee60bf70-341b-11e9-b3cd-95ab117178a8'],
            choices: {
              'ee60bf70-341b-11e9-b3cd-95ab117178a8': {
                id: 'ee60bf70-341b-11e9-b3cd-95ab117178a8',
                name: 's1',
                color: 'blue',
              },
            },
          },
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_reference', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'referenceFieldForTest',
          type: 'reference',
          typeOptions: {
            relationship: 'one',
            referenceTableId: base.primaryTableId,
          },
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_multipleAttachment', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'multipleAttachmentFieldForTest',
          type: 'multipleAttachment',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_execute', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'executeFieldForTest',
          type: 'execute',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_progress', function(done) {
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
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('ok_select', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'selectFieldForTest',
          type: 'select',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('tableId');
          res.body.should.have.property('fieldTypeId');
          res.body.should.have.property('type');
          res.body.should.have.property('width');
          res.body.should.have.property('typeOptions');
          done();
        });
    });
    it('err_unsupported_fieldType', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/field')
        .send({
          tableId: base.primaryTableId,
          name: 'test',
          type: 'test',
        })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
  describe('update', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/field')
        .send({
          fieldId: fieldIdForUpdate,
          name: 'newTextFieldForTest',
          type: 'text',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('delete', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .delete(`/api/field/${fieldIdForDelete}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_fieldId_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/field/')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
  describe('resize-column', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .put(`/api/resize-column`)
        .send({
          fieldId: fieldIdForUpdate,
          width: 200,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_params_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/resize-column')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  //   describe('POST /api/resize-column', function(done) {
  //     describe('ERROR', function(done) {
  //       it('Missing parameters', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .post('/api/resize-column')
  //           .send({})
  //           .end((err, res) => {
  //             res.should.have.status(400);
  //             done();
  //           });
  //       });
  //       describe('OK', function(done) {
  //         it('fieldId: fldnQ4OWns9ZF88nC, width: 200', function(done) {
  //           chai
  //             .request('http://localhost:8000')
  //             .post('/api/resize-column')
  //             .send({
  //               fieldId: 'fldnQ4OWns9ZF88nC',
  //               width: 200,
  //             })
  //             .end((err, res) => {
  //               res.should.have.status(200);
  //               done();
  //             });
  //         });
  //         it('check width', function(done) {
  //           chai
  //             .request('http://localhost:8000')
  //             .get('/api/table/tblNGUPdSs9Va4X5u')
  //             .end((err, res) => {
  //               res.should.have.status(200);
  //               const field = findIndex(
  //                 res.body.viewDatas[0].columnOrder,
  //                 function(o) {
  //                   return o.id == 'fldnQ4OWns9ZF88nC';
  //                 },
  //               );
  //               res.body.viewDatas[0].columnOrder[field].width.should.be.eql(200);
  //               done();
  //             });
  //         });
  //       });
  //     });
  //   });
  //   describe('PUT /api/field', function(done) {
  //     describe('ERROR', function(done) {
  //       it('Missing parameters', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .put('/api/field')
  //           .send({})
  //           .end((err, res) => {
  //             res.should.have.status(400);
  //             done();
  //           });
  //       });
  //       it('error fieldId', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .put('/api/field')
  //           .send({
  //             fieldId: '1111111111',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(403);
  //             done();
  //           });
  //       });
  //       it('error fieldTypeId', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .put('/api/field')
  //           .send({
  //             fieldId: 'fldnQ4OWns9ZF88nC',
  //             fieldTypeId: '10',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(403);
  //             done();
  //           });
  //       });
  //     });
  //     describe('OK', function(done) {
  //       it('text --> foreignKey', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .put('/api/field')
  //           .send({
  //             fieldId: textId,
  //             name: 'test',
  //             fieldTypeId: '3',
  //             typeOptions: {
  //               relationship: 'test one',
  //               foreignTableId: 'tblsnmRLfttLmAYQ8',
  //             },
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //     });
  //   });
  //   describe('DELETE /api/delete-field', function(done) {
  //     describe('ERROR', function(done) {
  //       it('not fieldId', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({})
  //           .end((err, res) => {
  //             res.should.have.status(400);
  //             done();
  //           });
  //       });
  //       it('error fieldId', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({
  //             fieldId: '11111111',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //     });
  //     describe('OK', function(done) {
  //       it('txt fieldId: fldnQ4OWns9ZF88nC', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({
  //             fieldId: 'fldnQ4OWns9ZF88nC',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //       it('number fieldId: fld6tojhqApRQfJpd', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({
  //             fieldId: 'fld6tojhqApRQfJpd',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //       it('foreignKey fieldId: fld6tojhqApRQfJpi', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({
  //             fieldId: 'fld6tojhqApRQfJpi',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //       it('multipleAttachment fieldId: fldIwYLcbYWSUa4aK', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .delete('/api/delete-field')
  //           .send({
  //             fieldId: 'fldIwYLcbYWSUa4aK',
  //           })
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             done();
  //           });
  //       });
  //       it('get tables', function(done) {
  //         chai
  //           .request('http://localhost:8000')
  //           .get('/api/tables/bse1jT7ZIHLmjH4')
  //           .end((err, res) => {
  //             res.should.have.status(200);
  //             let columns = res.body.tableSchemas[0].columns;
  //             let txt = findIndex(columns, function(o) {
  //               return o.id == 'fldnQ4OWns9ZF88nC';
  //             });
  //             let number = findIndex(columns, function(o) {
  //               return o.id == 'fld6tojhqApRQfJpd';
  //             });
  //             let foreignKey = findIndex(columns, function(o) {
  //               return o.id == 'fld6tojhqApRQfJpi';
  //             });
  //             let multipleAttachment = findIndex(columns, function(o) {
  //               return o.id == 'fldIwYLcbYWSUa4aK';
  //             });
  //             let symmetricField = findIndex(
  //               res.body.tableSchemas[1].columns,
  //               function(o) {
  //                 return o.id == 'fld6tojhqApRQfJ2d';
  //               },
  //             );
  //             expect(txt, 'error txt').to.eql(-1);
  //             expect(number, 'error number').to.eql(-1);
  //             expect(foreignKey, 'error foreignKey').to.eql(-1);
  //             expect(multipleAttachment, 'error multipleAttachment').to.eql(-1);
  //             expect(symmetricField, 'error symmetricField').to.eql(-1);
  //             done();
  //           });
  //       });
  //     });
  //   });
});
