const express = require('express');
const jsoncsv = require('express-json-csv')(express);
const expressEdge = require('express-edge');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const edge = require('edge.js');
const proxy = require('http-proxy-middleware');
const path = require('path');
const Move = require('./database/models/Move')

var app = express();

// Mongoose Database
mongoose.connect('mongodb://localhost/gamegamegame6', { useNewUrlParser: true });
const mongoStore = connectMongo(expressSession);

app.use(expressSession({
	secret: 'secret',
	store: new mongoStore({
		mongooseConnection: mongoose.connection
	})
}))

// define controllers and assign paths
const homePageController = require('./controllers/homePage');
const consentFormController = require('./controllers/consentFormController');
const orientConnectFourController = require('./controllers/orientConnectFourController');
const orientNeuralNetworkController = require('./controllers/orientNeuralNetworkController');
const orientExperimentController = require('./controllers/orientExperimentController');
const newGameController = require('./controllers/newGameController');
const storeMoveController = require('./controllers/storeMoveController');
const storeGameController = require('./controllers/storeGameController');
const questionnaireController = require('./controllers/questionnaireController');
const storequestionnaireController = require('./controllers/storequestionnaireController');
// mongoose.connect("mongodb://localhost/az_four_master", { useNewUrlParser: true });

app.use(express.static('public'));
app.use(expressEdge);
app.set('views', `${__dirname}/views`);


app.use('*', (req, res, next) => {
	edge.global('auth', req.session.userId && req.session.gamePlayed >= 10) // original 3
	//edge.global('finished', req.session.finished="yes")
	next()
})

// uses api to access the AZFour models
app.use('/api/000001', proxy({ target: 'http://localhost:9001', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000003', proxy({ target: 'http://localhost:9003', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000005', proxy({ target: 'http://localhost:9005', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000007', proxy({ target: 'http://localhost:9007', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000010', proxy({ target: 'http://localhost:9010', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000020', proxy({ target: 'http://localhost:9020', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000050', proxy({ target: 'http://localhost:9050', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/build")))

// middleware checks logic on games played, consent, and creating new user
const auth = require("./middleware/auth");
const auth2 = require("./middleware/auth2");
const auth3 = require("./middleware/auth3");
const createUser = require("./middleware/createUser");
//const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

app.get('/', homePageController);

// controllers for consent form and creating a new user
// currently in consent form to new game
app.get('/consentForm', auth, consentFormController);
//app.post('/play/newGame', auth, createUser, newGameController);
app.post('/orient/orientExperiment', auth, createUser, orientExperimentController)

// controllers to render orientations in sequence
app.get('/orient/orientConnectFour', auth3, orientConnectFourController);
app.get('/orient/orientNeuralNetwork', auth3, orientNeuralNetworkController);
app.get('/orient/orientExperiment', auth3, orientExperimentController);

// post orientations controllers to render games
app.get('/play/newGame', auth3, newGameController);
app.post('/play/newMove', auth, storeMoveController);
app.post('/play/nextGame', auth, storeGameController);

// post experiment controllers to render and store questionnaire
app.get('/questionnaire', auth2, questionnaireController);
app.post('/newquestionnaire', auth2, storequestionnaireController);

app.get('/download/csv', (req, res) => {
	Move.find().lean().exec(function (err, moves) { 
		console.log(moves);
		return res.csv(moves,{fields:['_id','humanChoice','yellowChoice','optimumChoice','effective','gUserId','gGameId','timeOfHumanChoice','timeOfSwitchSelection','yellowValue','optimumValue','selection','redGeneration','redSetting','yellowGeneration','yellowSetting','dataStorageTimePoint','gStep','_v']});
	 })
})

app.use((req, res) => res.render('not-found'));
app.listen(4000);
console.log("listening now on port 4000");

global.GAME_MODE = process.argv[2];

