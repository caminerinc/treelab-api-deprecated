const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('fields模块', function(done) {
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
          done();
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
          done();
        });
    });
    it('get table', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/tables/bse1jT7ZIHLmjH4')
        .end((err, res) => {
          res.should.have.status(200);

          res.body.tableSchemas[0].columns[5].should.have
            .property('name')
            .eql('age');
          res.body.tableSchemas[0].columns[5].should.have
            .property('type')
            .eql('number');
          expect(res.body.tableSchemas[0].columns[5].typeOptions).to.eql({
            format: 'decimal',
            precision: 1,
            negative: false,
          });

          res.body.tableSchemas[0].columns[6].should.have
            .property('name')
            .eql('测试');
          res.body.tableSchemas[0].columns[6].should.have
            .property('type')
            .eql('foreignKey');
          res.body.tableSchemas[0].columns[6].typeOptions.should.have.property(
            'symmetricFieldId',
          );
          res.body.tableSchemas[0].columns[6].typeOptions.should.have
            .property('relationship')
            .eql('many');
          res.body.tableSchemas[0].columns[6].typeOptions.should.have
            .property('foreignTableId')
            .eql('tblsnmRLfttLmAYQ8');

          res.body.tableSchemas[1].columns[1].should.have
            .property('name')
            .eql('Link');
          res.body.tableSchemas[1].columns[1].should.have
            .property('type')
            .eql('foreignKey');
          res.body.tableSchemas[1].columns[1].typeOptions.should.have.property(
            'symmetricFieldId',
          );
          res.body.tableSchemas[1].columns[1].typeOptions.should.have
            .property('relationship')
            .eql('many');
          res.body.tableSchemas[1].columns[1].typeOptions.should.have
            .property('foreignTableId')
            .eql('tblNGUPdSs9Va4X5u');
          done();
        });
    });
  });
});
