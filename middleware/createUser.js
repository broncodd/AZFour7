const User = require('../database/models/User')
const config = require('../config.json')

var gUserId=1;


// 4 groups for Experiment 3
// The aggregation for counting user in each group0
var agg = [
	{
		$group: {
			_id: "$assignedGroup",
			total: {$sum: 1}
		}
	},
	{
		$match:{
			returnCode:{
				$exists: true,
			}
		}
	}
];


module.exports = (req,res, next)=>{

	// This part finds the number of users in each assigned Groups, then only assign people to groups if there is
	// fewer than certain number of people in a group
	User.aggregate(agg, function(err, groupCount){
		if (err) { console.log(err); }
		// console.log(groupCount);
		var availGroups = [];
		for (i=1; i<=4; i++){
			var overLimit = false;
			if (i == 1) {
				overLimit = true;
				continue;
			}

			for (j=0; j<groupCount.length; j++){
				if (groupCount[j]['_id'] == i) {
					if (groupCount[j]['total'] > config.groupMax) {
						overLimit = true;
						continue;
					}
				}
			}
			if (!overLimit) {
				availGroups.push(i);
			}
		}
		// console.warn(availGroups);
		var query = User.find().sort({gUserId: -1}).limit(1);
		query.exec(function (err, docs) {
			if (err) return handleError(err);
			console.log(docs);
			if (docs.length == 0){
				gUserId = config.startUserId;
			}else{
				gUserId = docs[0].gUserId + 1;
			}
			console.log("new open user id is " + gUserId)

			if (!req.session.userId){


				console.log("session no userId");
				req.session.userId=gUserId;
				req.session.decision="agreed";
				// create a random variable to assign participatns to 1
				// of the 4 groups
				// var grandomNum = Math.floor(Math.random() * 4) +1;
				var grandomNum = availGroups[Math.floor(Math.random() * availGroups.length)];
				req.session.randomNum = grandomNum;
				// random assignment to groups 1-4
				var gameVersion;
				if (grandomNum==1) {
					gameVersion="newGame";
				} else if (grandomNum==2) {
					gameVersion="newGame2";
				} else if (grandomNum==3) {
					gameVersion="newGame3";
				} else if (grandomNum==4) {
					gameVersion="newGame4";
				} else {
					gameVersion="newGame5";
				}
				console.log("generated game version : "+gameVersion);

				// hard set game to newgame for development; remove later
				// for random assignment
				gameVersion="newgame";
				req.session.gameVersion=gameVersion;
				if (!req.session.gamePlayed){
					req.session.gamePlayed = parseInt(0);
					req.session.gameWinned = parseInt(0);
					req.session.gameDrawed = parseInt(0);
					req.session.gameLost = parseInt(0);
				}
				// gUserId++;
				console.log("session userId assigned to: "+req.session.userId);

				// Add a testing method so we can control which group the user is assigned to
				if (GAME_MODE != undefined){
					grandomNum = GAME_MODE;
				}

				User.create({
					gUserId:req.session.userId,
					userCreationTimePoint: new Date(),
					gamePlayed: 0,
					gameWinned: 0,
					gameDrawed: 0,
					gameLost: 0,
					decision: "agreed",
					gameVersion: gameVersion,
					userIP:req.headers['x-forwarded-for'] || req.connection.remoteAddress,
					assignedGroup: grandomNum,
				}, (error, user) => {console.log("error: "+error);
					console.log("type of user: "+ typeof user)
					if(user){
						//res.status(200).send(user);
						//res.end();
						console.log("stringify");
						console.log(JSON.stringify(user));
					}else{
						var error = {error:error};
						console.log("typeof error: "+typeof error);
						res.status(500).send(error);
						//res.end();
						return res.redirect('/')
					}
					next();
				})
			}else{
		}});

		console.log("entering CREATE USER controller");
	});
}