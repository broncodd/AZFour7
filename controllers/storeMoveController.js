const Move = require('../database/models/Move')
module.exports = (req, res) => {
  console.log("storeMoveController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  // console.log("req.body.username: "+req.body.username);
	// console.log("req.body.: "+JSON.stringify(req.body));
	var gGameId=req.body.gGameId;
 	var timeOfHumanChoice = parseFloat(req.body.timeOfHumanChoice);
  var timeOfSwitchSelection = parseFloat(req.body.timeOfSwitchSelection);
  var humanChoice = req.body.humanChoice;
  var yellowChoice = req.body.yellowChoice;
  var yellowValue = req.body.yellowValue;
  var yellowMessage = req.body.yellowMessage;
  var optimumChoice = req.body.optimumChoice;
  var optimumValue = req.body.optimumValue;
  var optimumMessage = req.body.optimumMessage;
  var selection = parseFloat(req.body.selection);
  var redGeneration=req.body.redGeneration;
  var redSetting= req.body.redSetting;
  var yellowGeneration=req.body.yellowGeneration;
  var yellowSetting=req.body.yellowSetting;
  var gStep=req.body.gStep;
  var assignedGroup=req.body.assignedGroup;
  var teamConfValue=req.body.teamConfValue;
  var humanConfValue=req.body.humanConfValue;
  var teamChoice=req.body.teamChoice;
  var movesSinceLastChange=req.body.movesSinceLastChange;
  Move.create({
    gUserId:req.session.userId,
    gGameId:gGameId,
    timeOfHumanChoice: timeOfHumanChoice,
    timeOfSwitchSelection: timeOfSwitchSelection,
    teamConfValue:teamConfValue,
    humanConfValue:humanConfValue,
    humanChoice: humanChoice, 
    yellowChoice: yellowChoice, 
    yellowValue: yellowValue,
    yellowMessage: yellowMessage,
    optimumChoice: optimumChoice, 
    optimumValue: optimumValue,
    optimumMessage: optimumMessage,
    selection: selection,
    redGeneration: redGeneration,
    redSetting: redSetting,
    teamChoice: teamChoice,
    movesSinceLastChange: movesSinceLastChange,
    yellowGeneration: yellowGeneration,
    yellowSetting: yellowSetting,
    dataStorageTimePoint: new Date(),
    gStep: gStep,
	assignedGroup: assignedGroup,
  }, (error, move) => {
    console.log("error: "+error);
    console.log("type of move: "+ typeof move)
    if(move){
      res.status(200).send(move);
    }else{
      var error = {error:error};
      console.log("typeof error: "+typeof error);
      res.status(500).send(error);
    }
  })
}
//const currentuser = await  User.findById(req.session.userId);