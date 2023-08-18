const Move = require('../database/models/Move')
const User = require('../database/models/User')
const config = require('../config.json')

// Experiment #3 Mapping
const playOrderGroupMapping = {
	1: `playFirst`,
	2: `playFirst`,
	3: `playFirst`,
	4: `playFirst`,
}

const recommenderModelGroupMapping = {
	1: "000005",
	2: "000005",
	3: "000005",
	4: "000005",
}
const recommenderSkillGroupMapping = {
	1: '3',
	2: '3',
	3: '3',
	4: '3',
}
const recommenderTypeGroupMapping = {
	1: `rank`,
	2: `rank`,
	3: 'rank',
	4: 'rank',
}

const recommenderValueGroupMapping = {
	1: ``, // none is hidden
	2: ``,
	3: '', // empty is show
	4: '',
}

// mapping for stages
const opponentModelStage1 = {
	1: `000010`,
	2: `000003`,
	3: '000010',
	4: '000003',
}
const opponentModelStage2 = {
	1: `000003`,
	2: `000010`,
	3: '000003',
	4: '000010',
}
const opponentModelStage3 = {
	1: `000010`,
	2: `000003`,
	3: '000010',
	4: '000003',
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
		console.log("The value used for the user is %s", recommenderValueGroupMapping[group]);
		console.log("The sequence used for the user is %s", playOrderGroupMapping[group]);


	//	return res.render( `newGame` ,{
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


	// if (req.session.gamePlayed<1){
	//  	console.log("gGameIdd2.1: "+gGameIdd);
	
	return res.render(`newGame`,{
		skill_choice_c: "5",
		model_choice_c: opponentModelStage1[group],
		skill_choice_u: recommenderSkillGroupMapping[group],
		model_choice_u: recommenderModelGroupMapping[group],
		gGameIdd: `${gGameIdd}`,
		gGameWinnedd: `${gGameWinnedd}`,
		gGameDrawedd: `${gGameDrawedd}`,
		gGameLostd: `${gGameLostd}`,
		agentType: recommenderTypeGroupMapping[group],
		agentValue: recommenderValueGroupMapping[group],
		assignedGroup: group,
		playOrder: playOrderGroupMapping[group],
		displayRecommenderMessage: recommenderValueGroupMapping[group],
	});
	// }else if (req.session.gamePlayed>=1 && req.session.gamePlayed < 2 ){
	//      	console.log("gGameIdd2.2: "+gGameIdd);
	//
	//     return res.render(`newGame`,{
	//         skill_choice_c: "5",
	//  		model_choice_c: opponentModelStage2[group],
	//  		skill_choice_u: recommenderSkillGroupMapping[group],
	//  		model_choice_u: recommenderModelGroupMapping[group],
	//  		gGameIdd: `${gGameIdd}`,
	//  		gGameWinnedd: `${gGameWinnedd}`,
	//  		gGameDrawedd: `${gGameDrawedd}`,
	//  		gGameLostd: `${gGameLostd}`,
	// 		agentType: recommenderTypeGroupMapping[group],
	// 		agentValue: recommenderValueGroupMapping[group],
	// 		assignedGroup: group,
	// 		playOrder: playOrderGroupMapping[group],
	// 	});
	// }else{
	//       	console.log("gGameIdd2.3: "+gGameIdd);
	//
	// 	return res.render(`newGame`,{
	//     	gGameIdd: `${gGameIdd}`,
	//         skill_choice_c: "5",
	//  		model_choice_c: opponentModelStage3[group],
	//  		skill_choice_u: recommenderSkillGroupMapping[group],
	//  		model_choice_u: recommenderModelGroupMapping[group],
	//  		gGameWinnedd: `${gGameWinnedd}`,
	//  		gGameDrawedd: `${gGameDrawedd}`,
	//  		gGameLostd: `${gGameLostd}`,
	// 		agentType: recommenderTypeGroupMapping[group],
	// 		agentValue: recommenderValueGroupMapping[group],
	// 		assignedGroup: group,
	// 		playOrder: playOrderGroupMapping[group],
	// 	});
	// }
});
}