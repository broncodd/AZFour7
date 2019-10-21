const Move = require('../database/models/Move')
//This is when page is refreshed
module.exports = (req,res)=>{
	console.log("entering new game controller"); 
	console.log("req.session.gamePlayed: "+req.session.gamePlayed);
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


	
	if (req.session.gamePlayed>=1 && req.session.gamePlayed<2){
		console.log("gGameIdd2.1: "+gGameIdd);
				
        return res.render(`${gameVersion}`,{
			skill_choice_c: "7",
			model_choice_c: "000005",
			skill_choice_u: "3",
			model_choice_u: "000005",
			gGameIdd: `${gGameIdd}`,
			gGameWinnedd: `${gGameWinnedd}`,
			gGameDrawedd: `${gGameDrawedd}`,
			gGameLostd: `${gGameLostd}`,
	});
	}else if (req.session.gamePlayed>=2 ){
    	console.log("gGameIdd2.2: "+gGameIdd);
		
        return res.render(`${gameVersion}`,{
        	skill_choice_c: "7",
			model_choice_c: "000005",
			skill_choice_u: "3",
			model_choice_u: "000005",
			gGameIdd: `${gGameIdd}`,
			gGameWinnedd: `${gGameWinnedd}`,
			gGameDrawedd: `${gGameDrawedd}`,
			gGameLostd: `${gGameLostd}`,
		});
     }else{
     	console.log("gGameIdd2.3: "+gGameIdd);
        return res.render(`${gameVersion}`,{
        	gGameIdd: `${gGameIdd}`,
        	skill_choice_c: "7",
			model_choice_c: "000005",
			skill_choice_u: "3",
			model_choice_u: "000005", 
			gGameWinnedd: `${gGameWinnedd}`,
			gGameDrawedd: `${gGameDrawedd}`,
			gGameLostd: `${gGameLostd}`,
			
		});
     }
}




