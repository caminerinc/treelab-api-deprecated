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
          res.body.tableSchemas[0].should.have.property('id');
          res.body.tableSchemas[0].should.have.property('name');
          res.body.tableSchemas[0].should.have.property('columns');
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
          expect(res.body).eql({
            tableDatas: {
              id: 'tblNGUPdSs9Va4X5u',
              rowsById: {
                recfPInitd1QpZ6aV: {
                  id: 'recfPInitd1QpZ6aV',
                  createdAt: '2018-05-05T04:09:06.024Z',
                  cellValuesByColumnId: {
                    fldnQ4OWns9ZF88nC: 'Muller',
                    fld6tojhqApRQfJpd: 34,
                    fld6tojhqApRQfJpc: 'Ren',
                  },
                },
                recwEKHeMhcDnLnfc: {
                  id: 'recwEKHeMhcDnLnfc',
                  createdAt: '0018-05-05T04:09:06.024Z',
                  cellValuesByColumnId: {
                    fld6tojhqApRQfJpd: 24,
                    fld6tojhqApRQfJpi: ['rec1db61c8d540400f'],
                    fldnQ4OWns9ZF88nC: 'Rob',
                    fld6tojhqApRQfJpc: 'Ricky',
                    fldIwYLcbYWSUa4aK: [
                      {
                        id: 'attqdl74Yu4DjbLvc',
                        fieldValueId: 7,
                        url:
                          'https://dl.airtable.com/yP8sUJ2qQ22T0Jl8cBS4_W%20THXU%20SHACKER%20SL%20PO%20-%209.27%20Fit%20rej.pdf',
                        fileName: 'W THXU SHACKER SL PO - 9.27 Fit rej.pdf',
                        fileType: 'application/pdf',
                      },
                    ],
                  },
                },
              },
            },
            viewDatas: [
              {
                columnOrder: [
                  {
                    id: 'fldIwYLcbYWSUa4aK',
                  },
                  {
                    id: 'fld6tojhqApRQfJpi',
                  },
                  {
                    id: 'fld6tojhqApRQfJpd',
                  },
                  {
                    id: 'fld6tojhqApRQfJpc',
                  },
                  {
                    id: 'fldnQ4OWns9ZF88nC',
                  },
                ],
                rowOrder: [
                  {
                    id: 'recfPInitd1QpZ6aV',
                  },
                  {
                    id: 'recwEKHeMhcDnLnfc',
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
