const User = require('../database/models/User')
const config = require('../config.json')
const playOrderGroupMapping = {
	1: `playFirst`,
	2: `playFirst`,
	3: `recoFirst`,
	4: `recoFirst`,
	5: `playFirst`,
	6: `playFirst`,
	7: `recoFirst`,
	8: `recoFirst`,
	9: `playFirst`,
	10: `playFirst`,
	11: `recoFirst`,
	12: `recoFirst`,
	13: `playFirst`, //Treatment group; no sequence
}
const recommenderTypeGroupMapping = {
	1: `probability`,
	2: `probability`,
	3: 'probability',
	4: 'probability',
	5: `discrete`,
	6: `discrete`,
	7: `discrete`,
	8: `discrete`,
	9: `rank`,
	10: `rank`,
	11: `rank`,
	12: `rank`,
	13: `none`, //Treatment group; no display
}

//This is when page is refreshed
module.exports = (req,res)=>{
	var group;

	// Find the user using the id in session, and use its attribute to configure the new game
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	query.select('assignedGroup');
	query.exec(function (err, user) {
		if (err) return handleError(err);
		group = user.assignedGroup;
	
		return res.render( `orientExperiment` ,{
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			'group': group,
			playOrder: playOrderGroupMapping[group],
		});
	});
}