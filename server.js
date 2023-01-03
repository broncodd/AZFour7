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
const config = require('./config.json')

var app = express();

// Mongoose Database
// mongoose.connect('mongodb://localhost/gamegamegame6', { useNewUrlParser: true , useUnifiedTopology: true});
// mongoose.connect('mongodb://azfourgame:azfourgame@127.0.0.1:27017/AZFour5?authSource=AZFour5', {useNewUrlParser: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000});
mongoose.connect(config.dbUrl,  {useNewUrlParser: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000});

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
const orientConfidenceController = require('./controllers/orientConfidenceController');
const newGameController = require('./controllers/newGameController');
const newGame2Controller = require('./controllers/newGame2Controller');
const storeMoveController = require('./controllers/storeMoveController');
const storeGameController = require('./controllers/storeGameController');
const questionnaireController = require('./controllers/questionnaireController');
const storeQuestionnaireController = require('./controllers/storeQuestionnaireController');

app.use(express.static('public'));
app.use(expressEdge);
app.set('views', `${__dirname}/views`);


app.use('*', (req, res, next) => {
	edge.global('auth', req.session.userId && req.session.gamePlayed >= config.maxGame) // original 3
	//edge.global('finished', req.session.finished="yes")
	next()
})

// uses api to access the AZFour models
app.use('/api/000001', proxy({ target: 'http://127.0.0.1:9001', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000003', proxy({ target: 'http://127.0.0.1:9003', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000005', proxy({ target: 'http://127.0.0.1:9005', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000007', proxy({ target: 'http://127.0.0.1:9007', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000010', proxy({ target: 'http://127.0.0.1:9010', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000020', proxy({ target: 'http://127.0.0.1:9020', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));
app.use('/api/000050', proxy({ target: 'http://127.0.0.1:9050', changeOrigin: true, ignorePath: true, logLevel: 'debug' }));

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
//app.post('/orient/orientExperiment', auth, createUser, orientExperimentController)
app.post('/orient/orientConnectFour', auth, createUser, orientConnectFourController)

// controllers to render orientations in sequence
app.get('/orient/orientConnectFour', auth3, orientConnectFourController);
app.get('/orient/orientNeuralNetwork', auth3, orientNeuralNetworkController);
app.get('/orient/orientExperiment', auth3, orientExperimentController);
app.get('/orient/orientConfidence', auth3, orientConfidenceController);

// post orientations controllers to render games
app.get('/play/newGame', auth3, newGameController);
app.get('/play/newGame2', auth3, newGame2Controller);
app.post('/play/newMove', auth, storeMoveController);
app.post('/play/nextGame', auth, storeGameController);

// post experiment controllers to render and store questionnaire
app.get('/questionnaire', auth2, questionnaireController);
app.post('/newquestionnaire', auth2, storeQuestionnaireController);

app.get('/download/csv', (req, res) => {
	Move.find().lean().exec(function (err, moves) { 
		console.log(moves);
		return res.csv(moves,{fields:['_id','humanChoice','yellowChoice',
		'optimumChoice','effective','gUserId','gGameId','timeOfHumanChoice',
		'timeOfSwitchSelection','yellowValue','yellowMessage', 'optimumValue',
		'optimumMessage','selection', 'redGeneration','redSetting','yellowGeneration','yellowSetting',
		'dataStorageTimePoint','gStep','_v']});
	 })
})

app.use((req, res) => res.render('not-found'));
app.listen(4000);
console.log("listening now on port 4000");

global.GAME_MODE = process.argv[2];

