const User = require('../database/models/User')

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
	  		'group': group,
	  	});
    });


}

