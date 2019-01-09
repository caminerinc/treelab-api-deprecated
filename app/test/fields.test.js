const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const { indexOf, findIndex } = require('lodash');

chai.use(chaiHttp);
describe('tables模块', function(done) {
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
            expect(txt, 'error txt').to.eql(-1);
            expect(number, 'error number').to.eql(-1);
            expect(foreignKey, 'error foreignKey').to.eql(-1);
            expect(multipleAttachment, 'error multipleAttachment').to.eql(-1);

            let symmetricField = findIndex(
              res.body.tableSchemas[1].columns,
              function(o) {
                return o.id == 'fld6tojhqApRQfJ2d';
              },
            );
            expect(
              res.body.tableSchemas[1].columns[symmetricField],
              'error symmetricField',
            ).to.have.property('type', 'text');
            done();
          });
      });
    });
  });
});
