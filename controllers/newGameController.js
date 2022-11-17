const Move = require('../database/models/Move')
const User = require('../database/models/User')
const config = require('../config.json')

// Version 5.x Mapping
// const recommenderModelGroupMapping = {
// 	1: "000001",
// 	2: "000005",
// 	3: "000020",
// 	4: "000001",
// 	5: "000005",
// 	6: "000020",
// 	7: "000001",
// }

// const groupTypeMapping = {
// 	1: `newGame`,
// 	2: `newGame`,
// 	3: `newGame`,
// 	4: `newGame2`,
// 	5: `newGame2`,
// 	6: `newGame2`,
// 	7: `newGame3`,
// }

// const recommenderTypeGroupMapping = {
// 	1: `probability`,
// 	2: `probability`,
// 	3: `rank`,
// 	4: `discrete`,
// 	5: `discrete`,
// 	6: `discrete`,
// 	7: `none`,
// }


// Version 6.x Mapping
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

const recommenderModelGroupMapping = {
	1: "000001",
	2: "000005",
	3: "000001",
	4: "000005",
	5: "000001",
	6: "000005",
	7: "000001",
	8: "000005",
	9: "000001",
	10: "000005",
	11: "000001",
	12: "000005",
	13: "000005", //Treatment group; no recommender
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
		console.log("The sequence used for the user is %s", playOrderGroupMapping[group]);
		

		return res.render( `newGame` ,{
			skill_choice_c: "7",
			model_choice_c: config.model_choice_c,
			skill_choice_u: "3",
			model_choice_u: recommenderModelGroupMapping[group],
			gGameIdd: `${gGameIdd}`,
			gGameWinnedd: `${gGameWinnedd}`,
			gGameDrawedd: `${gGameDrawedd}`,
			gGameLostd: `${gGameLostd}`,
			agentType: recommenderTypeGroupMapping[group],
			assignedGroup: group,
			playOrder: playOrderGroupMapping[group],
		});
	});

	// if (req.session.gamePlayed>=1 && req.session.gamePlayed<2){
	// 	console.log("gGameIdd2.1: "+gGameIdd);
	//
	//         return res.render(`${gameVersion}`,{
	// 		skill_choice_c: "7",
	// 		model_choice_c: "000005",
	// 		skill_choice_u: "3",
	// 		model_choice_u: "000005",
	// 		gGameIdd: `${gGameIdd}`,
	// 		gGameWinnedd: `${gGameWinnedd}`,
	// 		gGameDrawedd: `${gGameDrawedd}`,
	// 		gGameLostd: `${gGameLostd}`,
	// });
	// }else if (req.session.gamePlayed>=2 ){
	//     	console.log("gGameIdd2.2: "+gGameIdd);
	//
	//         return res.render(`${gameVersion}`,{
	//         	skill_choice_c: "7",
	// 		model_choice_c: "000005",
	// 		skill_choice_u: "3",
	// 		model_choice_u: "000005",
	// 		gGameIdd: `${gGameIdd}`,
	// 		gGameWinnedd: `${gGameWinnedd}`,
	// 		gGameDrawedd: `${gGameDrawedd}`,
	// 		gGameLostd: `${gGameLostd}`,
	// 	});
	//      }else{
	//      	console.log("gGameIdd2.3: "+gGameIdd);
	//         return res.render(`${gameVersion}`,{
	//         	gGameIdd: `${gGameIdd}`,
	//         	skill_choice_c: "7",
	// 		model_choice_c: "000005",
	// 		skill_choice_u: "3",
	// 		model_choice_u: "000005",
	// 		gGameWinnedd: `${gGameWinnedd}`,
	// 		gGameDrawedd: `${gGameDrawedd}`,
	// 		gGameLostd: `${gGameLostd}`,
	//
	// 	});
	//      }
}




