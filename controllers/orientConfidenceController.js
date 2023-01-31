const User = require('../database/models/User')
const config = require('../config.json')

const recommenderTypeGroupMapping = {
	1: `probability`,
	2: `probability`,
	3: 'discrete',
	4: 'discrete',
	5: `rank`,
	6: `rank`,
	7: `none`, //Treatment group; no display
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
		});
	});
}