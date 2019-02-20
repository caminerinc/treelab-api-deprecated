const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

let base = {};
describe('tables模块', function() {
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
  describe('create', function(doe) {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ baseId: base.id, name: 'createForTest' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('err_table_exist', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({ baseId: base.id, name: 'createForTest' })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('err_params_missing', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/table')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('getAllTables', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/tables/' + base.id)
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
  describe('getTable', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table/' + base.primaryTableId)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('not tableId', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table')
        .end((err, res) => {
          res.should.have.status(405);
          done();
        });
    });
  });
  describe('shallowRows', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .get('/api/table/' + base.primaryTableId + '/shallow-rows')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('update', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .put('/api/table')
        .send({ tableId: base.primaryTableId, name: 'newTable' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('bulkTables', function() {
    it('ok', function(done) {
      chai
        .request('http://localhost:8000')
        .post('/api/public/bulk-tables')
        .send({
          baseId: base.id,
          tables: `[{"name": "sheet0", "fields": [{"name": "Fiscal Season", 
          "type": "text", "typeOptions": null, "values": ["Division", 
          "Tech Designer"]}, {"name": "FA18", "type": "text", "typeOptions": null,
           "values": ["CHILDRENS", "BRITTANY BAKER"]}]}]`,
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
        .delete('/api/table/' + base.primaryTableId)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
