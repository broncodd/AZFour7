const Move = require('../database/models/Move')
const User = require('../database/models/User')

const groupModelMapping = {
	1: "000001",
	2: "000005",
	3: "000020",
	4: "000001",
	5: "000005",
	6: "000020",
	7: "000001",
}

const groupTypeMapping = {
	1: `newGame`,
	2: `newGame`,
	3: `newGame`,
	4: `newGame2`,
	5: `newGame2`,
	6: `newGame2`,
	7: `newGame3`,
} 

const agentTypeMapping = {
	1: `probability`,
	2: `probability`,
	3: `probability`,
	4: `discrete`,
	5: `discrete`,
	6: `discrete`,
	7: `none`,
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
  	console.log("The Model used for the user is %s", groupModelMapping[group]);
	
      return res.render( `newGame` ,{
  		skill_choice_c: "7",
  		model_choice_c: "000005",
  		skill_choice_u: "3",
  		model_choice_u: groupModelMapping[group],
  		gGameIdd: `${gGameIdd}`,
  		gGameWinnedd: `${gGameWinnedd}`,
  		gGameDrawedd: `${gGameDrawedd}`,
  		gGameLostd: `${gGameLostd}`,
		agentType: agentTypeMapping[group],
		assignedGroup: group,
	});

	
	// group = 2;
	/*

	Need logic to assign skills by groups
	1, 2, 3, are probability
	4, 5, 6, are discrete
	7 is the control group


	var model = "000005"
	if (grandomNum = 1) {
		model = "000001";
	} else if (grandomNum = 2) {
		model = "000005";
	} else if (grandomNum = 3) {
		model = "000020";
	} else if (grandomNum = 4) {
		model = "000001";
	} else if (grandomNum = 5) {
		model = "000005";
	} else if (grandomNum = 6) {
		model = "000020";
	} else {
		model = "000005";
	}
	*/
	// console.warn(req.session);
	// console.warn(group);
	
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




