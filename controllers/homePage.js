const User = require('../database/models/User')
const config = require('../config.json')

module.exports = (req,res)=>{
	console.log("entering HomePage--req.session: "+JSON.stringify(req.session));
	console.log("entering HomePage--req.session.userId: "+req.session.userId);
	var returnCode=req.session.returnCode;
	var preturnCode=config.prolificCode;
	// console.log("This is the Amazon MTurk returnCode: "+returnCode);
	// console.log("This is the Prolific returnCode: "+preturnCode);
	res.render('index', {
		returnCode:`${returnCode}`,
		preturnCode: config.prolificCode,
	});
	
}