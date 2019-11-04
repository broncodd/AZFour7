const mongoose = require('mongoose')

/**
 * @class MoveSchema
 */
const MoveSchema = new mongoose.Schema({

  // gUserId: {
  // 	type:mongoose.Schema.Types.ObjectId, 
  // 	ref: 'User',
  // 	required: true
  // },
  gUserId: Number,
  gaveVersion: String,
  grandomNum: Number,
  gGameId: Number,
  timeOfHumanChoice: Number,
  timeOfSwitchSelection:Number,
  humanChoice : Array,
  yellowChoice : [Number],
  yellowValue : String,
  optimumChoice : [Number],
  optimumValue : String,
  selection:Number,
  redGeneration: Number,
  redSetting:Number,
  yellowGeneration: Number,
  yellowSetting: Number,
  dataStorageTimePoint: Date,
  gStep: Number,
  assignedGroup: Number,
  effective: {
    type :String, default:"yes"
  }
})

MoveSchema.statics.changeEffectiveByGameId = function(gGameId){
  console.log("gGameId: "+gGameId); 
  this.find({"gGameId" : gGameId}, function(err,results){
    if (err){
      console.log("err: "+err);
    }else{
      for(j = 0; j < results.length; j++) {
       results[j].effective="no"; 
        results[j].save();
       } 
    }     
  });
}


module.exports = mongoose.model('Move', MoveSchema)