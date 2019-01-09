const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('tables模块', function(done) {
  describe('GET /api/tables/:baseId', function(done) {
    it('not baseId', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/tables')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('baseId: bse1jT7ZIHLmjH4', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/tables/bse1jT7ZIHLmjH4')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tableSchemas');
          expect(res.body).to.not.equal({
            tableSchemas: [
              {
                id: 'tblNGUPdSs9Va4X5u',
                name: 'Orders',
                columns: [
                  {
                    id: 'fldnQ4OWns9ZF88nC',
                    name: 'First Name',
                    type: 'text',
                  },
                  {
                    id: 'fld6tojhqApRQfJpc',
                    name: 'Last Name',
                    type: 'text',
                  },
                  {
                    id: 'fld6tojhqApRQfJpd',
                    name: 'Age',
                    typeOptions: {
                      format: 'decimal',
                      precision: 1,
                      negative: false,
                    },
                    type: 'number',
                  },
                  {
                    id: 'fld6tojhqApRQfJpi',
                    name: 'Link to PO',
                    typeOptions: {
                      relationship: 'many',
                      foreignTableId: 'tblsnmRLfttLmAYQ8',
                      symmetricFieldId: 'fld6tojhqApRQfJ2d',
                    },
                    type: 'foreignKey',
                  },
                  {
                    id: 'fldIwYLcbYWSUa4aK',
                    name: 'Attachment List',
                    typeOptions: {},
                    type: 'multipleAttachment',
                  },
                  {
                    id: 'fld1e05015ad40400b',
                    name: 'age',
                    typeOptions: {
                      format: 'decimal',
                      precision: 1,
                      negative: false,
                    },
                    type: 'number',
                  },
                  {
                    id: 'fld1e05015b940401b',
                    name: '测试',
                    typeOptions: {
                      relationship: 'many',
                      foreignTableId: 'tblsnmRLfttLmAYQ8',
                      symmetricFieldId: 'fld1e05015ba40402b',
                    },
                    type: 'foreignKey',
                  },
                ],
              },
              {
                id: 'tblsnmRLfttLmAYQ8',
                name: 'PO',
                columns: [
                  {
                    id: 'fld6tojhqApRQfJ2d',
                    name: 'Link to Order',
                    typeOptions: {
                      relationship: 'many',
                      foreignTableId: 'tblNGUPdSs9Va4X5u',
                      symmetricFieldId: 'fld6tojhqApRQfJpi',
                    },
                    type: 'foreignKey',
                  },
                  {
                    id: 'fld1e05015ba40402b',
                    name: 'Link',
                    typeOptions: {
                      relationship: 'many',
                      foreignTableId: 'tblNGUPdSs9Va4X5u',
                      symmetricFieldId: 'fld1e05015b940401b',
                    },
                    type: 'foreignKey',
                  },
                ],
              },
            ],
          });
          done();
        });
    });
  });

  describe('GET /api/table/:tableId', function(done) {
    it('not tableId', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
    it('error tableId', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table/1111111')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('tableId: tblNGUPdSs9Va4X5u', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table/tblNGUPdSs9Va4X5u')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body).to.eql({
            tableDatas: {
              id: 'tblNGUPdSs9Va4X5u',
              rowsById: {
                rec1e0514c9440407f: {
                  id: 'rec1e0514c9440407f',
                  createdAt: '2019-01-09T01:46:06.801Z',
                  cellValuesByColumnId: {},
                },
              },
            },
            viewDatas: [
              {
                columnOrder: [
                  {
                    id: 'fldnQ4OWns9ZF88nC',
                  },
                  {
                    id: 'fld6tojhqApRQfJpc',
                  },
                  {
                    id: 'fld6tojhqApRQfJpd',
                  },
                  {
                    id: 'fld6tojhqApRQfJpi',
                  },
                  {
                    id: 'fldIwYLcbYWSUa4aK',
                  },
                  {
                    id: 'fld1e0514c7000404b',
                  },
                  {
                    id: 'fld1e0514c7780405b',
                  },
                ],
                rowOrder: [
                  {
                    id: 'rec1e0514c9440407f',
                  },
                ],
              },
            ],
          });
          done();
        });
    });
  });
});
