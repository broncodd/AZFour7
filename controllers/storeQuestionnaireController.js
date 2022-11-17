const User = require('../database/models/User')
module.exports = (req, res) => {
  console.log("storeQusetionaireController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  var sns1 = req.body.sns1;
  var sns2 = req.body.sns2;
  var sns3 = req.body.sns3;
  var sns4 = req.body.sns4;
  var sns5 = req.body.sns5;
  var sns6 = req.body.sns6;
  var sns7 = req.body.sns7;
  var sns8 = req.body.sns8;
  var Competence = req.body.Competence;
  var Predictability = req.body.Predictability;
  var Dependability = req.body.Dependability;
  var Reliability = req.body.Reliability;
  var Trust = req.body.Trust;
  var Satisfaction = req.body.Satisfaction;
  var SelfConfidence = req.body.SelfConfidence;
  var RiskAware = req.body.RiskAware;
  var year = req.body.year;
  var educationalBackground = req.body.educationalBackground;
  var TypeOfEducation = req.body.TypeOfEducation;
  var AIMLGE = req.body.AIMLGE;
  var profession = req.body.profession;
  var comments=req.body.comments;
  

  //find user in da and complete user's information based on questionnaire
  User.find({ gUserId: req.session.userId}, function (err, docs) {
    if (err){
      console.log("err: "+err);
    }else{
      var somebody = docs[0];
      if (somebody.returnCode){
        return res.render('thankyou', {
          returnCode: `${somebody.returnCode}`
        });
      }
      var returnCode=(Math.random().toString(36).substring(2, 16) +
      Math.random().toString(36).substring(2, 16)).toUpperCase();
      req.session.returnCode=returnCode;
      console.log(JSON.stringify(somebody));


      somebody.sns1=req.body.sns1;
      somebody.sns2=req.body.sns2;
      somebody.sns3=req.body.sns3;
      somebody.sns4=req.body.sns4;
      somebody.sns5=req.body.sns5;
      somebody.sns6=req.body.sns6;
      somebody.sns7=req.body.sns7;
      somebody.sns8=req.body.sns8;
      somebody.Competence=Competence;
      somebody.Predictability=Predictability;
      somebody.Dependability=Dependability;
      somebody.Reliability=Reliability;
      somebody.Trust=Trust;
      somebody.Satisfaction=Satisfaction;
      somebody.SelfConfidence=SelfConfidence;
      somebody.RiskAware=RiskAware;
      somebody.year=year;
      somebody.educationalBackground=educationalBackground;
      somebody.TypeOfEducation=TypeOfEducation;
      somebody.AIMLGE=AIMLGE;
      somebody.profession=profession;
      somebody.comments=comments;
      somebody.returnCode=returnCode;

      console.log("After adding questionnaire: " + JSON.stringify(somebody));

      somebody.save().then(function(response){
        return res.render('thankyou', {
          returnCode: `${returnCode}`
        });
      }).catch(function (error){
        console.log("somebody save error "+error);
      });
    }
  });
}
