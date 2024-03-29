const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({

  // gUserId: {
  // 	type:mongoose.Schema.Types.ObjectId, 
  // 	ref: 'User',
  // 	required: true
  // },
  gUserId: String,
  gameVersion: String,
  grandomNum: Number,
  gGameId: String,
  gOutcome : String, 
  totalTime: Number, 
  humanToAgentTrust: Number, 
  humanToHimselfTrust: Number,
  attribute: Number,
  redModel:String, 
  redSkill:String,
  yellowModel:String,
  yellowSkill: String,
  dataStorageTimePoint: Date,
  assignedGroup: Number,
})



module.exports = mongoose.model('Game', GameSchema)