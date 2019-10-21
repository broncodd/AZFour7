const User = require('../database/models/User')
module.exports = (req,res)=>{
	console.log("entering HomePage--req.session: "+JSON.stringify(req.session));
	console.log("entering HomePage--req.session.userId: "+req.session.userId);
	var returnCode=req.session.returnCode;
	console.log("This is the returnCode: "+returnCode);
	res.render('index', {
		returnCode:`${returnCode}`,
	});
	
}