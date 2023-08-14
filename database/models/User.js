
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  gUserId: {
    type: Number,
    unique: true,
    required: true
  },
  gamePlayed: {
    type: Number,
    required: true
  },
  gameWinned: {
    type: Number,
    required: true
  },
  gameDrawed: {
    type: Number,
    required: true
  },
  gameLost: {
    type: Number,
    required: true
  },
  sns1: {
    type: Number,
  },
  sns2: {
    type: Number,
  },
  sns3: {
    type: Number,
  },
  sns4: {
    type: Number,
  },
  sns5: {
    type: Number,
  },
  sns6: {
    type: Number,
  },
  sns7: {
    type: Number,
  },
  sns8: {
    type: Number,
  },
  pretrust: {
    type: Number,
  },
  preconf: {
    type: Number,
  },
  Competence: {
    type: Number,
  },
  Predictability: {
    type: Number,
  },
  Dependability: {
    type: Number,
  },
  Reliability: {
    type: Number,
  },
  Trust: {
    type: Number,
  },
  Satisfaction: {
    type: Number,
  },
  SelfConfidence: {
    type: Number,
  },
  RiskAware: {
    type: Number,
  },
  year: {
    type: Number,
  },
  gender: {
    type: String,
  },
  race: {
    type: String,
  },
  ethnicity: {
    type: String,
  },
  educationalBackground: {
    type: String,
  },
  TypeOfEducation: {
    type: String,
  },
  AIMLGE: {
    type: Number,
  },
  profession: {
    type: Number,
  },
  comments: {
    type: String,
  },
  userCreationTimePoint:Date, 
  decision: {
  	type :String,
  },
  returnCode: {
    type :String,
  },
  userIP: {
    type :String,
  }, 
  gameVersion: {
    type :String,
  },
  grandomNum: {
    type :Number,
  },
  assignedGroup: {
  	type: Number,
	required: true,
  }
})

UserSchema.statics.changeGamePlayedByUserId = function(gUserId, gOutcome){
  console.log("UserSchema.statics.changeGamePlayedByUserId in!");
	console.log("gUserId: "+gUserId); 
  console.log("gOutcome: "+gOutcome); 
	this.find({"gUserId" : gUserId}, function(err,results){
		if (err){
			console.log("err: "+err);
		}else{
			var somebody = results[0]; 

		var previous = somebody.gamePlayed; 
		var current = previous+1;
		somebody.gamePlayed=current;
      if (gOutcome=="Red"){
        somebody.gameLost++;
      }else if (gOutcome=="Yellow"){
        somebody.gameWinned++;
      }else{
        somebody.gameDrawed++;
      }
		somebody.save();
		}
		 
	});
}


module.exports = mongoose.model('User', UserSchema)

