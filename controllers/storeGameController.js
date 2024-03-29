const Game = require('../database/models/Game')
const User = require('../database/models/User')
const config = require('../config.json')

module.exports = (req, res) => {
	console.log("storeGameController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  // console.log("req.body.username: "+req.body.username);
	// console.log("req.body.: "+JSON.stringify(req.body));
  console.log("original  gamePlayed: "+req.session.gamePlayed); 
	req.session.gamePlayed++; 
  console.log("gamePlayed changed to "+req.session.gamePlayed); 
  console.log("req.body.gOutcome: "+req.body.gOutcome); 
  var gOutcome=req.body.gOutcome; 
  console.log("gOutcome: "+gOutcome); 
  if (gOutcome=="Red"){
    req.session.gameLost++;
  }else if (gOutcome=="Yellow"){
    req.session.gameWinned++;
  }else{
    req.session.gameDrawed++;
  }
Game.create({
  ...req.body, 
  gUserId:req.session.userId,
  assignedGroup:req.body.assignedGroup, // may need to delete
  dataStorageTimePoint: new Date()
}, (error, game) => {console.log("error: "+error);
   console.log("type of game: "+ typeof game)
   if(game){//store game success
    User.changeGamePlayedByUserId(req.session.userId, req.body.gOutcome);
    if (req.session.gamePlayed< config.maxGame){
      if (req.session.gamePlayed>=4 && req.session.gamePlayed<7){
        res.append('stage2', 'true');
        console.log('entering stage 2');
      }
      if (req.session.gamePlayed>=7 ){
        res.append('stage3', 'true');
        console.log('entering stage 3');
      }
      res.status(200).send(game);
      console.log("gamePlayed rechecked: "+req.session.gamePlayed);
      res.end();
    }else{
      res.append('gameFinished', 'true');
      res.status(200).send(game);
      console.log("back end: user finished!");
      res.end();
    }
  }else{
    var error = {error:error};
    console.log("typeof error: "+typeof error);
    res.status(500).send(error);
    res.end();
  }
}) 
}




















//const currentuser = await  User.findById(req.session.userId);