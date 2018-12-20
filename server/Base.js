const Provider = require('fishbone_c').Provider;
const glob = require("glob");
const path = require("path");
const dir = path.resolve(__dirname);
const controller = {};
const dao = {};

//Controller
controller.api = require('./Controllers/api');


//dao
dao.api = require('./Dao/apiDao');

//model
const db = glob.sync(`/model/**`, {root: dir,nodir: true,nocase: true});
class Base extends Provider{
	constructor() {
		super();

		for (let v of Object.keys(db)) {
			this.registerModel(require(db[v].replace(/`${dir}server`/g, '.')));
		}
		this.registerDao(dao);
		this.registerController(controller);
	}
}
module.exports = new Base();