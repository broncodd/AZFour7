const User = require('../database/models/User')
var gUserId=1; 
module.exports = (req,res, next)=>{

	console.log("entering CREATE USER controller"); 
	if (!req.session.userId){
		console.log("session no userId");
		req.session.userId=gUserId;
		req.session.decision="agreed";
		// create a random variable to assign participatns to 1
		// of the 7 groups
		var grandomNum = Math.floor(Math.random() * 7) +1;
		req.session.randomNum = grandomNum;
		// random assignment to groups 1-7
		var gameVersion;
		if (grandomNum==1) {
			gameVersion="newGame";
		} else if (grandomNum==2) {
			gameVersion="newGame2";
		} else if (grandomNum==3) {
			gameVersion="newGame3";
		} else if (grandomNum==4) {
			gameVersion="newGame4";
		} else if (grandomNum==5) {
			gameVersion="newGame5";
		} else if (grandomNum==6) {
			gameVersion="newGame6";
		} else {
			gameVersion="newGame7";
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
		gUserId++;
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
next();
}	
}