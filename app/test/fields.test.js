const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

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
  });
});
