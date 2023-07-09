const User = require('../database/models/User')
module.exports = (req, res) => {
  console.log("storeQusetionaireSNSController in !");
  console.log("req.body.: "+JSON.stringify(req.body));
  var sns1 = req.body.sns1;
  var sns2 = req.body.sns2;
  var sns3 = req.body.sns3;
  var sns4 = req.body.sns4;
  var sns5 = req.body.sns5;
  var sns6 = req.body.sns6;
  var sns7 = req.body.sns7;
  var sns8 = req.body.sns8;
  

  //find user in db and complete user's information based on questionnaire
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
      console.log(JSON.stringify(somebody));


      somebody.sns1=req.body.sns1;
      somebody.sns2=req.body.sns2;
      somebody.sns3=req.body.sns3;
      somebody.sns4=req.body.sns4;
      somebody.sns5=req.body.sns5;
      somebody.sns6=req.body.sns6;
      somebody.sns7=req.body.sns7;
      somebody.sns8=req.body.sns8;


      console.log("After adding SNS questionnaire: " + JSON.stringify(somebody));
      
      // need follow-up action to saving the form
      // continue to the connect four orientation
      somebody.save().then(function(response){
        return res.render('orientConnectFour');
      }).catch(function (error){
        console.log("somebody save error "+error);
      });
    }
  });
}
