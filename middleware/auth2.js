
// this is a counter check to ensure there are game to play until max
// also set to the maximum

const config = require('../config.json')

module.exports = (req, res, next) => {
  if (!req.session.userId || req.session.gamePlayed<config.maxGame) {
      return res.redirect('/')
  } 
  next();
  
}

