
// this is a counter check to ensure there are game to play until max
// also set to the maximum

module.exports = (req, res, next) => {
  if (!req.session.userId || req.session.gamePlayed<10) {
      return res.redirect('/')
  } 
  next();
  
}

