const Move = require('../database/models/Move')
const User = require('../database/models/User')
const config = require('../config.json')

// Experiment 3 Mapping
const playOrderGroupMapping = {
	1: `playFirst`,
	2: `recoFirst`,
	3: `playFirst`,
	4: `recoFirst`,
	5: `playFirst`,
	6: `recoFirst`,
	7: `playFirst`, //Treatment group; no sequence
}

const recommenderModelGroupMapping = {
	1: "000005",
	2: "000005",
	3: "000005",
	4: "000005",
	5: "000005",
	6: "000005",
	7: "000005", //Treatment group; no recommender
}
const recommenderSkillGroupMapping = {
	1: '2',
	2: '2',
	3: '2',
	4: '2',
	5: '2',
	6: '2',
	7: '2', //Treatment group; no display
}
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
	var group;
	console.log("entering new game controller");
	console.log("req.session.gamePlayed: "+req.session.gamePlayed);
	// console.warn(req.session.userId);
	var gGameIdd = req.session.gamePlayed; //how many games user has already played
	var gGameWinnedd = req.session.gameWinned;
	var gGameDrawedd = req.session.gameDrawed;
	var gGameLostd = req.session.gameLost;
	console.log("gGameIdd: "+gGameIdd);
	console.log("gGameWinnedd: "+gGameWinnedd);
	var notFinishedGame=gGameIdd+1;
	Move.changeEffectiveByGameId(notFinishedGame);
	var gameVersion = req.session.gameVersion;
	var grandomNum = req.session.randomNum;

	// Find the user using the id in session, and use its attribute to configure the new game
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	query.select('assignedGroup');
	query.exec(function (err, user) {
		if (err) return handleError(err);
		group = user.assignedGroup;
		console.log('After querying, the assigned group is %s', user.assignedGroup);

		console.log("User of this session is %s", req.session.userId);
		console.log("The group of the user is %s", group);
		console.log("The display used for the user is %s", recommenderTypeGroupMapping[group]);
		console.log("The model used for the user is %s", recommenderModelGroupMapping[group]);
		console.log("The skill used for the user is %s", recommenderSkillGroupMapping[group]);
		console.log("The sequence used for the user is %s", playOrderGroupMapping[group]);
		

	//	return res.render( `newGame2` ,{
	//		skill_choice_c: "7",
	//		model_choice_c: config.model_choice_c,
	//		skill_choice_u: recommenderSkillGroupMapping[group],
	//		model_choice_u: recommenderModelGroupMapping[group],
	//		gGameIdd: `${gGameIdd}`,
	//		gGameWinnedd: `${gGameWinnedd}`,
	//		gGameDrawedd: `${gGameDrawedd}`,
	//		gGameLostd: `${gGameLostd}`,
	//		agentType: recommenderTypeGroupMapping[group],
	//		assignedGroup: group,
	//		playOrder: playOrderGroupMapping[group],
	//	});


	if (req.session.gamePlayed<1){
	 	console.log("gGameIdd2.1: "+gGameIdd);
	
	    return res.render(`newGame`,{
	 		skill_choice_c: "5",
	 		model_choice_c: "000003",
	 		skill_choice_u: "3",
	 		model_choice_u: "000005",
	 		gGameIdd: `${gGameIdd}`,
	 		gGameWinnedd: `${gGameWinnedd}`,
	 		gGameDrawedd: `${gGameDrawedd}`,
	 		gGameLostd: `${gGameLostd}`,
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			playOrder: playOrderGroupMapping[group],
	});
	}else if (req.session.gamePlayed>=1 && req.session.gamePlayed < 2 ){
	     	console.log("gGameIdd2.2: "+gGameIdd);
	
	    return res.render(`newGame`,{
	        skill_choice_c: "7",
	 		model_choice_c: "000020",
	 		skill_choice_u: "3",
	 		model_choice_u: "000005",
	 		gGameIdd: `${gGameIdd}`,
	 		gGameWinnedd: `${gGameWinnedd}`,
	 		gGameDrawedd: `${gGameDrawedd}`,
	 		gGameLostd: `${gGameLostd}`,
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			playOrder: playOrderGroupMapping[group],
	});
	}else{
	      	console.log("gGameIdd2.3: "+gGameIdd);
	         
		return res.render(`newGame`,{
	    	gGameIdd: `${gGameIdd}`,
	        skill_choice_c: "5",
	 		model_choice_c: "000003",
	 		skill_choice_u: "3",
	 		model_choice_u: "000005",
	 		gGameWinnedd: `${gGameWinnedd}`,
	 		gGameDrawedd: `${gGameDrawedd}`,
	 		gGameLostd: `${gGameLostd}`,
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			playOrder: playOrderGroupMapping[group],
	});
	}
});
}




