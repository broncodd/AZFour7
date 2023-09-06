const User = require('../database/models/User')
const config = require('../config.json')

module.exports = (req, res) => {
  console.log("storeQusetionaireController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  var Competence = req.body.Competence;
  var Predictability = req.body.Predictability;
  var Dependability = req.body.Dependability;
  var Reliability = req.body.Reliability;
  var Trust = req.body.Trust;
  var Satisfaction = req.body.Satisfaction;
  var SelfConfidence = req.body.SelfConfidence;
  var RiskAware = req.body.RiskAware;
  var humanSkillChange = req.body.humanSkillChange;
  var advisorSkillChange = req.body.advisorSkillChange;
  var opponentSkillChange = req.body.opponentSkillChange;
  var blame = req.body.blame;
  var credit = req.body.credit; 
  var year = req.body.year;
  var gender = req.body.gender;
  var race = req.body.race;
  var ethnicity = req.body.ethnicity;
  var educationalBackground = req.body.educationalBackground;
  var TypeOfEducation = req.body.TypeOfEducation;
  var AIMLGE = req.body.AIMLGE;
  var profession = req.body.profession;
  var prolificID = req.body.prolificID;
  var comments=req.body.comments;
  

  //find user in da and complete user's information based on questionnaire
  User.find({ gUserId: req.session.userId}, function (err, docs) {
    if (err){
      console.log("err: "+err);
    }else{
      var somebody = docs[0];
      if (somebody.returnCode){
        return res.render('thankyou', {
          preturnCode: config.prolificCode,
          returnCode: `${somebody.returnCode}`,
        });
      }
      var returnCode=(Math.random().toString(36).substring(2, 16) +
      Math.random().toString(36).substring(2, 16)).toUpperCase();
      req.session.returnCode=returnCode;
      console.log(JSON.stringify(somebody));

      somebody.Competence=Competence;
      somebody.Predictability=Predictability;
      somebody.Dependability=Dependability;
      somebody.Reliability=Reliability;
      somebody.Trust=Trust;
      somebody.Satisfaction=Satisfaction;
      somebody.SelfConfidence=SelfConfidence;
      somebody.RiskAware=RiskAware;
      somebody.humanSkillChange=humanSkillChange;
      somebody.advisorSkillChange=advisorSkillChange;
      somebody.opponentSkillChange=opponentSkillChange;
      somebody.blame=blame;
      somebody.credit=credit;
      somebody.year=year;
      somebody.gender=gender;
      somebody.race=race;
      somebody.ethnicity=ethnicity;
      somebody.educationalBackground=educationalBackground;
      somebody.TypeOfEducation=TypeOfEducation;
      somebody.AIMLGE=AIMLGE;
      somebody.profession=profession;
      somebody.prolificID=prolificID;
      somebody.comments=comments;
      somebody.returnCode=returnCode;

      console.log("After adding questionnaire: " + JSON.stringify(somebody));

      somebody.save().then(function(response){
        return res.render('thankyou', {
          returnCode: `${returnCode}`,
          preturnCode: config.prolificCode,
        });
      }).catch(function (error){
        console.log("somebody save error "+error);
      });
    }
  });
}
