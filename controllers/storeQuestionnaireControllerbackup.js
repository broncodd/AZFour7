const User = require('../database/models/User')
module.exports = (req, res) => {



	// Find the user using the id in session, and use its saved data for the stringify
	var query = User.findOne({
		'gUserId': req.session.userId,
	})
	query.select('sns1');
	query.exec(function (err, user) {
		if (err) return handleError(err);
		sns1 = user.sns1;
  });

	query.select('sns2');
	query.exec(function (err, user) {
		if (err) return handleError(err);
		sns2 = user.sns2;
  });

	query.select('sns3', 'sns4');
	query.exec(function (err, user) {
		if (err) return handleError(err);
    sns3 = user.sns4;
    sns3 = user.sns4;
  });

  console.log("storeQusetionaireController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  var sns1;
  var sns2;
  var sns3;
  var sns4;
  var sns5;
  var sns6;
  var sns7;
  var sns8;
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

      somebody.sns1=sns1;
      somebody.sns2=req.session.sns2;
      somebody.sns3=req.session.sns3;
      somebody.sns4=req.session.sns4;
      somebody.sns5=req.session.sns5;
      somebody.sns6=req.session.sns6;
      somebody.sns7=req.session.sns7;
      somebody.sns8=req.session.sns8;
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
