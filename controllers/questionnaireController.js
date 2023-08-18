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

module.exports = (req,res)=>{
	console.log("entering questionnaireController"); 
	var group;
	
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	query.select('assignedGroup');
	query.exec(function (err, user) {
	  if (err) return handleError(err);
	  group = user.assignedGroup;
	  console.log('After querying, the assigned group is %s', user.assignedGroup);
	  	return res.render(`questionnaire`, {
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			'group': group,
			playOrder: playOrderGroupMapping[group],
			recConfValue: recommenderValueGroupMapping[group],
	  	});
    });


}
