const User = require('../database/models/User')
const config = require('../config.json')

const playOrderGroupMapping = {
	1: `playFirst`,
	2: `playFirst`,
	3: `playFirst`,
	4: `playFirst`,
}
const recommenderTypeGroupMapping = {
	1: `rank`,
	2: `rank`,
	3: `rank`,
	4: `rank`,
}
const recommenderValueGroupMapping = {
	1: `display`, // needs to be hidden after beta test
	2: `display`,
	3: 'display',
	4: 'display',
}

//This is when page is refreshed
module.exports = (req,res)=>{
    console.log("entering orientConfidenceController");
    var group;

	// Find the user using the id in session, and use its attribute to configure the new game
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	query.select('assignedGroup');
	query.exec(function (err, user) {
		if (err) return handleError(err);
		group = user.assignedGroup;
	
		return res.render( `orientConfidence` ,{
			agentType: recommenderTypeGroupMapping[group],
			recConfValue: recommenderValueGroupMapping[group],
		});
	});
}