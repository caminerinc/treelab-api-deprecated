const ControllerBase = require('fishbone_c').ControllerBase;
const config=require('../Util/config');
/**
 * 用户模块
 */
class apiController extends ControllerBase{

	constructor(dao){
		super(dao);
	}

	/**
	 * health_check接口
	 * @return {int} code 状态码
	 * @return {string} msg Connection established
	 */
	async health_checkAction(data) {

		return {
			code: 200,
			msg: 'Connection established'
		}
	}
};

module.exports = apiController;

