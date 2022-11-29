const User = require('../database/models/User')

module.exports = (req,res)=>{

	console.log("entering orientExperimentController"); 
	var assignedGroup = req.session.assignedGroup;
	
	// Find the user using the id in session, and use its attribute to configure the orientation

	var group;
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	
	query.select('assignedGroup');
	
	query.exec(function (err, user) {
		if (err) return handleError(err);
		group = user.assignedGroup;
		console.log("The group used for the user is %s", group);
	});

	return res.render('orientExperiment');

}