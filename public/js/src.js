var ndarray = require('ndarray')
var graphpipe = require('graphpipe')
var axios = require('axios')

var gGameField = new Array(); // two dimensional array indicating the status of the board;
var gDiscs; // compute the total number of discs;
var gBoard = document.getElementById("game-table"); // this is the table in the html where;
// we need to place discs;
var gCurrentPlayer; // 1 means current term is red;
var gId = 1; //the 1st disc's number is 1;
var gModels = new Array(); // index 0 means red's model;
var gPredReady = new Array(); // index 1 means red model's prediction is ready;
var gPriors; // distribution of policy from the model before adjustment;
var gCompPlays = [true, false]; // Whether computer plays red/yellow;
var gDisableUI = false; // whether UI should be disbaled;

// initializes game tracking variables
var gGameId = 0;
var gGameWinned = 0; 
var gGameDrawed = 0; 
var gGameLost = 0;
var gGamePlayed = 0;
var grandomNum; //

var gTimeStamp0; // indicate when the game begins;
var gTimeStamp1; // indicate when the user is shown the input estimation boxes;
var gTimeStamp2; // indicate when the user click to submit the estimation input boxes;
var gTimeStamp3; // indicate when the user is shown the difference between his submission;
// and his agent's prediction;
var gTimeStamp4; // indicate when the user made a choice over him/herself or his/her agent;
var gTimeStamp5; // indicate when the game ends;
var gEstimations;// the user's input estimation array; 
var gOutcome; // game outcome;
var gStep=0;
var humanFirstChoice;
var preRecommendationConfidence;

// user's estimation distribution input over the seven columns
// not used
var gEstimation = document.getElementById("estimation");

// The agent type, can be probability, discrete, and none
var agentType;
var assignedGroup;
var playOrder;

// Check the board state
var isSymmetric;


// mapping for stages
const opponentModelStage1 = {
  1: `000010`,
  2: `000001`,
  3: '000010',
  4: '000001',
}
const opponentModelStage2 = {
  1: `000001`,
  2: `000010`,
  3: '000001',
  4: '000010',
}
const opponentModelStage3 = {
  1: `000010`,
  2: `000001`,
  3: '000010',
  4: '000001',
}


var chart = new Chart("myChart", {
  type: "bar",
  data: {
    labels: ["", "", "", "", "","", ""],
    datasets: [{
      backgroundColor: 'green',
      data: [1, 2, 3, 4, 5, 6, 7],
    }],
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true,
          max: 100
        }
      }]
    }
  }
});

// STAGE CHANGE
function setParameterForStage() {
  const group = Number(document.getElementById("assignedGroup").value);
  if (gGameId>=0 && gGameId<=3) {
    document.getElementById("ModelSelect1").setAttribute("value", opponentModelStage1[group]);
    agentType = "rank";
    document.getElementById("instructionWithoutAgent").style.display="none";
    document.getElementById("instructionWithAgent").style.display="";
    document.getElementById("recommenderSurvey").style.display = "";
  } else if (gGameId>=4 && gGameId<=6) {
    document.getElementById("ModelSelect1").setAttribute("value", opponentModelStage2[group]);
    agentType = "rank";
    document.getElementById("instructionWithoutAgent").style.display="none";
    document.getElementById("instructionWithAgent").style.display="";
    document.getElementById("recommenderSurvey").style.display = "";
  } else if (gGameId>=7 && gGameId<=9){
    document.getElementById("ModelSelect1").setAttribute("value", opponentModelStage3[group]);
    agentType = "rank";
    document.getElementById("instructionWithoutAgent").style.display="none";
    document.getElementById("instructionWithAgent").style.display="";
    document.getElementById("recommenderSurvey").style.display = "";
  } else {
    // After several games, play a game without any agent
    agentType = "none";
    // When agent is none, opponent level is 7
    document.getElementById("Skill1").setAttribute("value", "7");
    document.getElementById("ModelSelect1").setAttribute("value", "000003");
    document.getElementById("recommenderSurvey").style.display = "none";
    document.getElementById("instructionWithoutAgent").style.display="";
    document.getElementById("instructionWithAgent").style.display="none";
  }
  gModels[0] = document.getElementById("ModelSelect1").value;
  console.log("Setting model for recommender: " + gModels[0]);
}
// this function creates a new game, initializes a black board,;
// and sets red as the first player;
function newGame() {
  UIclear();
  UIreset();
  setParameterForStage();
  // console.log("pre gameId: "+gGameId);
  gGameId += 1;
  gGamePlayed++;
  // console.log("now gameId: "+gGameId);
  gStep=0;
  gBoard.innerHTML = ""; //clean up all the discs in the table;
  gDiscs = new Array();
  gPredReady = [false, false];
  prepareField();   //initailize every space 0;
  //current player's number is 1,index=0, computer red always makes the first move
  gCurrentPlayer = 1;
  gTimeStamp0=new Date();
  updatePredictions();
  addNewDisc(0);
  document.getElementById("movesSinceLastChange").textContent="0";
}

var first; 
var second;
var third; 

// initialization of between-game trust and confidence survey
// important for group names
$('input[type=radio][name=optradio]').click(function() {
  if (second==true && third==true){
    $('#newGame1').prop('disabled', false);
  }else{
    first=true;
  }
});

$('input[type=radio][name=yourselfRadio]').click(function() {
  if ((first==true && third==true) || agentType == "none"){
    $('#newGame1').prop('disabled', false);
  }else{
    second=true;
  }
});

$('input[type=radio][name=attributeRadio]').click(function() {
  if (first==true && second==true){
    $('#newGame1').prop('disabled', false);
  }else{
    third=true;
  }
});



// if 'newgame', then determine the stage and begin game
// important for group names
$("#newGame1").click(function() {
  //req.session.gamePlayed++;
  console.warn("Starting a new game...");
  // console.warn(req.session.gamePlayed);
  $("#message-modal").modal('hide');
  first=false;
  second=false;
  var totalTime=(gTimeStamp5.getTime() - gTimeStamp0.getTime())/1000;
  sendGameData().then(function(response){
    // gOutcome=null;
    // totalTime=null;
    // humanTrust=null;
    // gTimeStamp0=null;
    // gTimeStamp5=null;
    if(response.status==200){
      if(response.headers.stage2=="true" && !response.headers.gamefinished){
        console.log("stage2 begins");
        //gModels[0] = "000010";
        //gModels[1] = "000010";
      }
      if(response.headers.stage3=="true" && !response.headers.gamefinished){
        console.log("stage3 begins");
        //gModels[0] = "000003";
        //gModels[1] = "000003";
      }
      if(response.headers.gamefinished=="true"){
        console.log("user finished!");
        $('#message-modal2').modal('show');
        return;
      }
      if(gGameId == 10) {  // STAGE CHANGE (set to 10 for experiment 3)
        console.log("To free play stage...");
        gGameWinned = 0;
        gGameLost = 0;
        gGameDrawed = 0;
        gGamePlayed -= 10; // STAGE CHANGE
        $('#transitionModal').modal('show');
        return;
      }
      console.log("sendGameData success! "+JSON.stringify(response));
      $("input[name=optradio]").prop("checked",false);
      $("input[name=attributeRadio]").prop("checked",false);
      $("input[name=yourselfRadio]").prop("checked",false);
      $('#newGame1').prop('disabled', true);
      newGame();
    }
  }).catch(function (error){
    console.log("sendGameData error "+error);
  });
});

$('#transitionModal').on('hidden.bs.modal', function (e) {
  $('#transitionModal').modal('hide');
  $("input[name=optradio]").prop("checked",false);
  $("input[name=attributeRadio]").prop("checked",false);
  $("input[name=yourselfRadio]").prop("checked",false);
  $('#newGame1').prop('disabled', true);
  newGame();
})

// query the models and fetch the data from remote;
function loadRemote(model, b) {
  var id = gGameId;
  var arr = new Float32Array(2 * 6 * 7); //two parts, each has 6*7;
  for (var i=0; i<2*6*7; i++) {
    arr[i] = b[i];
  }
  var nda = ndarray(arr, [1, 2, 6, 7]); //construct 1 part, 2 groups, both have 6 rows and 7 cols;
  var req = graphpipe.remote("/api/" + model + "/", nda, "", "", ""); //fetch data from remote server;
  return req
}

function computerToPlay() {
  return gCompPlays[gCurrentPlayer-1];
}

function now() {
  var d = new Date()
  var n = d.getTime()
  return n
}

var gLastPlay = now()

function loop() {
  if (now() - gLastPlay < 1500) {
    return
  }
  if (computerToPlay()) {
    if (gPredReady[gCurrentPlayer]) {
      var disc = gDiscs[gDiscs.length - 1];
      playBestMove(disc);
      gLastPlay = now();
    }
  }
}


setInterval(loop, 500);

// this function returns adjusted priors based on skill level
function applyT(T, priors) {
  T = Math.floor(T);
  //every value represents a skill level
  if (T == 1) {
    T = 1;
  } else if (T == 2) {
    T = 0.8;
  } else if (T == 3) {
    T = 0.66;
  } else if (T == 4) {
    T = 0.5;
  } else if (T == 5) {
    T = 0.25;
  } else if (T == 6) {
    T = 0.1;
  } else if (T == 7) {
    T = 0.01;
  }
  var adjustedPriors = [];
  var adjustedTotal = 0;
  for (var i = 0; i < 7; i++) {
    //base is priors(from trained data), priors[i]^(1/T)
    adjustedPriors[i] = priors[i] ** (1/T);
    // compute the total 
    adjustedTotal += adjustedPriors[i];
  }
  for (var i = 0; i < 7; i++) {
    adjustedPriors[i] /= adjustedTotal;
  }
  console.log("Applying T=" + T + " to priors: " + priors);
  console.log("After ApplyT: " + adjustedPriors);
  return adjustedPriors;
}

// This function returns the column with the maximum value to select move
function argmax(array) {
  var max = -1;
  var maxIdx = 0;
  for (i = 0; i < array.length; i++) {
    if (possibleColumns().indexOf(i) != -1) {
      if (array[i] > max) {
        max = array[i];
        maxIdx = i;
      }
    }
  }
  return maxIdx;
}

function weightedChoice(array) {
  array = array.slice();
  var total = 0.0;
  //delete the value from column that is full
  for (var i = 0; i < array.length; i++) {
    if (possibleColumns().indexOf(i) == -1) {
      array[i] = 0;
    }
    total += array[i]; 
  }
  //recalculate the ratio
  for (var i = 0; i < array.length; i++) {
    array[i] /= total; 
  }
  var r = Math.random();
  var cur = 0.0;
  //not everytime we choose the largest one
  for (var i = 0; i < array.length; i++) {
    cur += array[i];
    if (r <= cur) {
      return i;
    }
  }
  alert('oh no');
}

// This function gets the skill value from HTML when it is activated
// HTML not activated for this experiment
function getSkillValue(player){
  var T = 1;
  if (player==1) {
    T = document.getElementById('Skill1').value;
  } else {
    T = document.getElementById('Skill2').value;
  }
  return T;
}

// This function drops the disk in the appropriate empty column according to argmax
function playBestMove(disc) {
  var T = getSkillValue(disc.player);
  console.log("T for playBestMove is:");
  var adjustedPriors = applyT(T, gPriors);
  var col = weightedChoice(adjustedPriors);
  dropDisc(disc, col);
}

// This function makes a model prediction based on the status of board sent to it
function updatePredictions() {
  //get current player's model
  var model = gModels[gCurrentPlayer - 1];
  if (model == null) {
    return;
  }
  //1st part is the current player
  //2nd part is the other player
  //this is an 1d array that will be sent to the model
  var b = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]

  //get all the discs, x contains all the discs
  var x = document.getElementsByClassName("disc");

  //current player's index
  var p = gCurrentPlayer - 1;

  //1 red (opponent), 2 yellow (participant and recommender)
  var current = p == 0 ? 1 : 2;
  var other = p == 0 ? 2 : 1;

  // when other people wanna just reshow the situations you have;
  for (var r = 0; r < gGameField.length; r++) { // 6 rows;
    for (var c = 0; c < gGameField[0].length; c++) { //7 columns;
      if (gGameField[r][c] == current) {
        b[r * 7 + c] = 1;//set 1 to represent this place has already been occupied;
      } else if (gGameField[r][c] == other) {
        b[r * 7 + c + 42] = 1;
      }
    };
  };
  
  isSymmetric = is_symmetry(b);

  //at present, we cannot do anything on the screen, because we're going to send data to models
  gDisableUI = true;

  console.log(current+"(1 red, 2 yellow) begins sending data of the current status on board to model--------->");

  loadRemote(model, b).then(function (response) {
    console.log("policy distribution and value received from model for player: "+current+" (1 red, 2 yellow)");
    var rslt = response.data;
    gPriors = rslt[0].data
    console.log(current+"(1 red, 2 yellow)'s gPriors: "+gPriors);
    value = rslt[1].data[0];
    console.log(current+"(1 red, 2 yellow)'s value: "+value);
    percentage = Math.floor(Math.abs(value) * 100) + "%"; //traslate the "value" to a String;
    message="thinks it looks like a draw";

    // red thinks yellow's winning percentage 
    // yellow thinks red's winning percentage
    if (value < -0.05 || value > 0.05) {
      color = "the opponent";
      //if red, value<-0.05 || if yellow,value>0.05
      if ((p == 0 && value < -0.05) || (p == 1 && value > 0.05)) {
        color = "we";
      }
      message = "is " + percentage + " confident that " + color + " will win";
    }
    
    if (p == 0) {
      message = "The opponent "+message;
    } else {
      message = "The advisor "+message;
    }

    gPredReady[p+1] = true;

    if(computerToPlay()){
      gDisableUI = false;
    }else{
      var optimumModel = "000050";
      return loadRemote(optimumModel, b);
    }
    
  }).then(function (response) {
    // alert("Finished update prediction...");
    console.log("policy distribution and value received from ORACLE for player: "+current+" (1 red, 2 yellow)");
    oRslt = response.data;
    optimumPriors = oRslt[0].data;
    console.log(current+"(1 red, 2 yellow)'s optimumPriors: "+optimumPriors);
    optimumValue = oRslt[1].data[0];
    console.log(current+"(1 red, 2 yellow)'s optimumValue: "+optimumValue);

    //the total win percentage
    optimumPercentage = Math.floor(Math.abs(optimumValue) * 100) + "%";
    optimumMessage=" thinks it looks like a draw";
    //red thinks yellow's winning percentage 
    ////yellow thinks red's winning percentage
    if (optimumValue < -0.05 || optimumValue > 0.05) {
      color = "the opponent";
      //if red, value<-0.05 || if yellow,value>0.05
      if ((p == 0 && optimumValue < -0.05) || (p == 1 && optimumValue > 0.05)) {
        color = "the Human AI Team";
      }
      optimumMessage = "is " + optimumPercentage + " sure that " + color + " will win";
    }

    if (p == 0) {
      optimumMessage = `The Oracle `+optimumMessage;
    } else {
      optimumMessage = `The Oracle `+optimumMessage;
    }
	console.log("ORACLE------");
    optimumAdjustedPriors = applyT(5, optimumPriors); // highest skill is 7; set to skill 5 for experiment #3;
    for(let i = 0; i<7; i++){
	
      optimumAdjustedPriors[i] = Math.round(optimumAdjustedPriors[i] * 100);
    }
    console.log(current+"(1 red, 2 yellow)'s optimumAdjustedPriors: "+optimumAdjustedPriors);

    //since data from model is back, UI can be active again now
    gDisableUI = false;

  }).then(function(response){
    // This function uses the response to update the value of submit buttons
    // TODO: Change logic so when recommend first
    // Update Prediction here instead after human submit
    if (playOrder === "recoFirst") {
      updateRecommendationToUI(agentType, true);
    }
    console.log("Update Reco Done!");
  }).catch(function (error) {
    console.log(error);
    console.log(current+"(1 red, 2 yellow)'s prdiction set processing from OPTIMUM MODEL is not ready. Error is: "+error);
    if (error.toString() == "Cancel") {
      return;
    }
  });
}


/**
 * Version 6.x
 * Function that updates the prediction value to UI
 * If recommend first, then update the value to the direct submit buttons
 * If play first, then update the value to the estimation inputs
 */
function updateRecommendationToUI(agentType, recoFirst) {
  // Calculation
  var T = getSkillValue(gCurrentPlayer);
  var adjustedPriors = applyT(T, gPriors);
  let rankArray = getRank(gPriors);
  adj_max = getAdjMax(adjustedPriors);
  adj_max_index = adj_max[1];
  adjustedPriors = adjustedPriors.map(
    x => Math.round(x * 100)
  );

  gTimeStamp1 = new Date();

  console.warn("Martin adjusted: " + adjustedPriors);
  console.warn("Agent Type: " + agentType + " RecoFirst is: " + recoFirst)

  // Deal with updating the direct submit buttons
  if (recoFirst) {
    document.getElementById("dropBtn").style.display="";
    document.getElementById("estSelectBtn").style.display="none";
    document.getElementById("scoSelectBtn").style.display=""; //changed from "none"
    document.getElementById("scoSelectBtn").value="AI Advice"; // added
    document.getElementById("agreeBtn").style.display="none";
    document.getElementById("estBtn").style.display="none";
    document.getElementById("scores").style.display="";
    document.getElementById("estimation").style.display="";
    document.getElementById("probabilityChart").style.display="none";

    // Update the chart values to reflect the recommendation
    chart.data.datasets[0].data = adjustedPriors;
    chart.update()

    for (let i = 0; i < 7; i++) {//compute every col's win's percentage
      document.getElementById('s'+ i).style="background-color:#fff";
      if (agentType == "probability"){
        document.getElementById( 's' + i).textContent = adjustedPriors[i]+ "%";
        document.getElementById("probabilityChart").style.display="";
      }
      if (agentType == "discrete"){
        document.getElementById('s' + i).textContent = "";
      }
      if (agentType == "rank"){
        if (rankArray[i] > 3){
          document.getElementById('s' + i).textContent = "";
        } else {
          document.getElementById('s' + i).textContent = "#" + rankArray[i];
        }
      }
        // document.getElementById('s' + i).textContent = "#" + rankArray[i];
      if (possibleColumns().indexOf(i) == -1){
        console.log(i+" column is full");
        document.getElementById('e' + i).value="FULL";
        document.getElementById('e' + i).style="background-color:red";
        document.getElementById('e' + i).disabled = true;
      }
    }
    if (agentType == "probability"){
      document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
    }
    if (agentType == "discrete"){
      document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
      document.getElementById('s'+ adj_max_index).textContent="X";
      document.getElementById("probabilityChart").style.display="none";
    }
    if (agentType == "rank"){
      document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
      document.getElementById("probabilityChart").style.display="none";
    }
  }

  // Deal with updating the input if human plays first
  // else {
  //
  //   est_max = getEstMax(gEstimations);
  //   est_max_index = est_max[1];
  //
  //   // Version 6.x:
  //   // Only green the estimated column instead of showing probabilities
  //   document.getElementById('e' + est_max_index).style = "background-color:green";
  //   document.getElementById('e' + est_max_index).value = "X";
  //   for (let i = 0; i < 7; i++) {
  //     if (agentType == "probability") {
  //       document.getElementById('s' + i).textContent = adjustedPriors[i] + "%";
  //     }
  //     if (agentType == "discrete") {
  //       document.getElementById('s' + i).textContent = "0";
  //       document.getElementById(idHeaderToUpdate + i).style="color:#fff";
  //     }
  //     if (agentType == "rank") {
  //       document.getElementById(idHeaderToUpdate + i).textContent = rankArray[i];
  //     }
  //     //stress the biggest one probability
  //     // document.getElementById('s'+ adj_max_index).style="background-color:green";
  //     // document.getElementById('e'+ est_max_index).style="background-color:green";
  //     //show human estimation value
  //     // document.getElementById('e' + i).value = gEstimations[i]+ "%";
  //     document.getElementById('s' + i).readonly = true;
  //     document.getElementById('s' + i).disabled = true;
  //     document.getElementById('e' + i).readonly = true;
  //     document.getElementById('e' + i).disabled = true;
  //   }
  //   if (agentType == 'discrete'){
  //     document.getElementById('s' + adj_max_index).textContent = "X";
  //     document.getElementById('s' + adj_max_index).style = "background-color:green";
  //   }
  // }
}


//when the page is loaded, this function will be called immediately, i.e entry point
window.onload = function() {
  //when we first load this page
  //jQuery http://api.jquery.com/prop/
  //check whether they are all autoplay
  //obtain the Generation Value 
  //when refresh, gGameId and gGameWinned, gGameDrawed, gGameLost are re-populated
  //preventing any un-committed data messing up database
  gModels[0] = document.getElementById("ModelSelect1").value;
  gModels[1] = document.getElementById("ModelSelect2").value;
  console.log("onload: "+document.getElementById("gGameIdd").value)
  gGameId=parseInt(document.getElementById("gGameIdd").value);
  console.log("onload:  gGameWinned original: "+gGameWinned);
  console.log("onload:  gGameWinned zhijiena: "+document.getElementById("gGameWinnedd").value);
  gGameWinned=parseInt(document.getElementById("gGameWinnedd").value);
  console.log("onload: after populated: "+gGameWinned);
  gGameDrawed=parseInt(document.getElementById("gGameDrawedd").value);
  console.log("onload: "+gGameDrawed);
  gGameLost=parseInt(document.getElementById("gGameLostd").value);
  console.log("onload: "+gGameLost);
  console.log("onload: "+gGameIdd);
  console.log("onload: "+typeof gGameIdd);
  agentType = document.getElementById("agentType").value;
  assignedGroup = document.getElementById("assignedGroup").value;
  playOrder = document.getElementById("playOrder").value
  // teamConfValue = $('.rangeslider__handle')
  console.log("Agent type is " + agentType);
  newGame();
  
  $('#message-modal2').on('hidden.bs.modal', function (e) {
	// console.log(JSON.stringify(req.body));
    window.setTimeout(function() {
      $(location).attr('href', '/questionnaire');
    }, 100);
  })
};

// This function checks for ties
function checkForTie() {
  return possibleColumns().length == 0;
}

// This function checks for victory based on connecting 4
function checkForVictory(row, col) {
  if ((getAdj(row, col, 0, 1) + getAdj(row, col, 0, -1) > 2) || 
  (getAdj(row, col, 1, 0) > 2) || 
  (getAdj(row, col, -1, 1) + getAdj(row, col, 1, -1) > 2) || 
  (getAdj(row, col, 1, 1) + getAdj(row, col, -1, -1) > 2)) {
    return true;
  }
}

// This function calls the adjacent location for victory function
function getAdj(row, col, row_inc, col_inc) {
  if (cellVal(row, col) == cellVal(row + row_inc, col + col_inc)) {
    return 1 + getAdj(row + row_inc, col + col_inc, row_inc, col_inc);
  } else {
    return 0;
  }
}

// This function obtains the correct value for a cell 
function cellVal(row, col) {
  if (gGameField[row] == undefined || gGameField[row][col] == undefined) {
    return -1;
  } else {
    return gGameField[row][col];
  }
}

function firstFreeRow(col) {
  var i;
  for (i = 0; i < 6; i++) {
    if (gGameField[i][col] != 0) {
      break;
    }
  }
  return i - 1;
}

function possibleColumns() {
  var moves_array = new Array();
  //we have 7 cols
  for (var i = 0; i < 7; i++) {
    //if the 0th row's col is 0
    if (gGameField[0][i] == 0) {
      //push 0,1,2,3,4,5,6
      moves_array.push(i);
    }
  }
  return moves_array;
}

var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var hSize = 91.4;
var vSize = 77.75;
var hOff = 10.75;
var vOff = 7;

if (isSafari) {
    vOff = 8.25;
    vSize = 77.8;
}

var maxScale = 0.75;
var scale = 0.75;

// This function resizes if necessary
function doResize() {
  var w = $(window).width();
  if (w < 768) {
    scale = (w/692);
  } else {
    scale = maxScale;
  }
  $("#game-outer").attr("style", "transform: scale(" + scale + "); transform-origin: 0 0;");
  $("#leftcol").attr("style", "height: " + 620 * scale + "px; padding-top:" + 30 * (scale**3) + "px;");
}
window.addEventListener("resize", function() {
  window.setTimeout(doResize, 100);
});

doResize()

// Creation function for a new disc
// when drop a new disc
function Disc(player, col) {
  console.log("Begin to create a new disc--------->");
  this.player = player;
  this.color = player == 1 ? 'red' : 'yellow'; //assign color;
  this.id = 'd' + gId.toString(); //assign disc id;
  this.row = 0; // initial row is 0;
  this.col = col; // initial column is the column that has been passed in;
  this.dropped = false; // the disc has not been dropped yet;
  // the next disc's number
  console.log("disc creation and initialization finished, newly created disc:  "+JSON.stringify(this));
  gId++;
  // create a place to put this new disc
  // this is a function that adds this disc created to the html in tags
  this.addToScene = function() {
    console.log("newly created disc being added to scene---->");
    var disc = document.createElement("div");
    disc.id = this.id; // create id;
    disc.className = "disc " + this.color;    // create the class name;
    gBoard.appendChild(disc)    // append this new child to the gBoard ->id = gametable;
    // set the place where the disc is;
    // hsize=91.4px the game-table is 640/7 = 91.4px, every col is 91.4px;
    // hOff=10.75px the original left;
    document.getElementById($this.id).style.left = (hOff + hSize * this.col) + "px";
    // 75px from the top (gameboard)
    document.getElementById($this.id).style.top = "-75px";
    console.log("newly created disc, disc id: "+this.id+", added to scene.");
  }

  // this is a finction that moves the disc to a specific column 
  this.moveToColumn = function(col) {
    $this.col = col;
    document.getElementById($this.id).style.left = (hOff + hSize * col) + "px";
    document.getElementById($this.id).style.top = "-75px";
    console.log("newly created disc, disc id: "+this.id+", moved to column: "+col);
  }

  var $this = this;

  this.drop = function(col) {
    console.log("newly created disc, disc id: "+this.id+", begins dropping process------>");
    // if there're data now sending to models, return,the disc can not drop
    if (gDisableUI) {
      return;
    }
    // if it is computer playing, just return
    // it has its own way of dropping
    if (gCompPlays[$this.player - 1]) {
      return;
    }

    // check whether this column is available for dropping the disc
    if (possibleColumns().indexOf($this.col) != -1) {
      dropDisc($this,$this.col);
    }else{
      alert("The Col is full");
    }
  }
}

function getRow(y) {
  y = y - $('#game-table').offset().top + vSize;
  return Math.floor(y/vSize);
}

function getCol(x) {
  x = x - $('#game-table').offset().left;
  x = x/scale;
  return Math.floor(x/(hSize+1));
}

// This function drops the disc;
function dropDisc(disc, col) {
  if (disc.dropped) {
    return;
  }
  console.log(disc.id +" begins to drop physically------------------->")
  disc.dropped = true;
  disc.moveToColumn(col);
  var row = firstFreeRow(disc.col);  // obtain that col's 1st hole;
  disc.row = row;
  gGameField[row][disc.col] = disc.player;
  //current prediction set is no more usable, waiting to be injected for the next round
  gPredReady[gCurrentPlayer] = false;
  var element = animateDiscDrop(disc.id, (vOff + row * vSize));   // animateDiscDrop to the right place;
  element.addEventListener("transitionend", function(e) {
    // transitionend fires twice (for horizontal and vertical motion) if
    // the disc hasn't caught up with the mouse's column.
    if (e.propertyName == 'top') {
      if (checkForVictory(disc.row, disc.col)) {
        var color = disc.player == 2 ? 'Yellow' : 'Red'; // can this be switched to 'Our team' : 'opponent'
		    var side_winning = disc.player == 2 ? 'Our Team' : 'The opponent'; 
        gTimeStamp5=new Date();
        gOutcome=color;
        if (gOutcome=="Red"){
          gGameLost++;
        }else{
          gGameWinned++;
        }
        // $("#modal-title-text").html(side_winning + " wins!\nThis is your game "+gGameId+ " You have won "
        //   +gGameWinned+" , You have drawed "+ gGameDrawed+" , You have lost "+gGameLost);
		
		    // Martin: Calculation for winning and losing percentage, based on new requirement
	  	  var win_perc = 0;
     	  var lose_perc = 0;
          var tie_perc = 0;
		    if (gGamePlayed == 0){
          win_perc = 0.00;
			    lose_perc = 0.00;
			    tie_perc = 0.00;
		    }else{
			    win_perc = (gGameWinned * 100/ gGamePlayed).toFixed(2);
			    lose_perc = (gGameLost * 100/ gGamePlayed).toFixed(2);
			    tie_perc = (gGameDrawed * 100/ gGamePlayed).toFixed(2);
		    }
	
		    $("#modal-title-text").html(side_winning + " wins! </br>"
		    + gGamePlayed + " game(s) played. </br>"
		    + gGameWinned + " game(s) won (" + win_perc +  "%). </br>"
		    + gGameLost + " game(s) lost (" + lose_perc +  "%). </br>"
		    + gGameDrawed + " game(s) tied (" + tie_perc +  "%). </br>");
	    	$('#message-modal').modal('show');
			if (assignedGroup == 7){
				first = true;
			}
	    	$('#newGame').prop('disabled', true);
		    window.scrollTo(0, 0);
		
      } else if (checkForTie()) {
        gTimeStamp5=new Date();
        gOutcome="tie"; 
        gGameDrawed++;
        
        // Martin: Calcualtion for winning and losing percentage, based on new requirement
	  	  var win_perc = 0;
        var lose_perc = 0;
        var tie_perc = 0;
        if (gGameId == 0){
          win_perc = 0.00;
          lose_perc = 0.00;
          tie_perc = 0.00;
       }else{
          win_perc = (gGameWinned * 100/ gGameId).toFixed(2);
          lose_perc = (gGameLost * 100/ gGameId).toFixed(2);
          tie_perc = (gGameDrawed * 100/ gGameId).toFixed(2);
       }
 
       $("#modal-title-text").html("It's a tie! </br>"
       + gGameId + " game(s) played. </br>"
       + gGameWinned + " game(s) won (" + win_perc +  "%). </br>"
       + gGameLost + " game(s) lost (" + lose_perc +  "%). </br>"
       + gGameDrawed + " game(s) tied (" + tie_perc +  "%). </br>");
       $('#message-modal').modal('show');
       $('#newGame').prop('disabled', true);
       window.scrollTo(0, 0);
   
      } else {
        changePlayer();
        updatePredictions();
        //if it is human's turn
        if(!computerToPlay()){
        //pop up table, bar and button to let user choose
          console.log("Playing now...")

          if (playOrder == "playFirst") {
            console.log("It is now the Human AI Team's turn. ")
            if (agentType == "none") {
              document.getElementById("scores").style.display="none"; //added
              document.getElementById("scoSelectBtn").style.display="none"; // added
            }
            else {
              document.getElementById("scores").style.display=""; //added
              document.getElementById("scoSelectBtn").style.display="none"; // added
              document.getElementById("scoSelectBtn").value="AI Advice"; // added
            }
            document.getElementById("estimation").style.display="";
            document.getElementById("estBtn").style.display="";
            document.getElementById("estSelectBtn").style.display="none";
            for(let i=0; i < 7; i++){
              document.getElementById("e"+i).value = "";
              document.getElementById("s"+i).textContent = " ";
              // document.getElementById("confidence"+i).value = 0;
              //document.getElementById('e' + i).readonly=false;
              document.getElementById('e' + i).disabled=false;
              if (possibleColumns().indexOf(i) == -1){
                console.log(i+" column is full");
                document.getElementById('e' + i).value="FULL";
                document.getElementById('e' + i).style="background-color:red";
                document.getElementById('e' + i).disabled = true;
                // document.getElementById("confidence"+i).value = 0;
                // document.getElementById("confidence"+i).disabled = true;
            }
          }
        }
        // document.getElementById("estimation").style.display="";
        // document.getElementById("estBtn").style.display="";
        // document.getElementById("estSelectBtn").style.display="none";
        // // document.getElementById("rangebarContainer").style.display="";
        // for(let i=0; i < 7; i++){
        //   document.getElementById("e"+i).value = "";
        //   document.getElementById("confidence"+i).value = 0;
        //   //document.getElementById('e' + i).readonly=false;
        //   document.getElementById('e' + i).disabled=false;
        //   if (possibleColumns().indexOf(i) == -1){
        //     console.log(i+" column is full");
        //     document.getElementById('e' + i).value="FULL";
        //     document.getElementById('e' + i).style="background-color:red";
        //     document.getElementById('e' + i).disabled = true;
        //     document.getElementById("confidence"+i).value = 0;
        //     document.getElementById("confidence"+i).disabled = true;
        //   }
        // }
        // this when user is shown the estimation input boxes
        gTimeStamp1 = new Date();
        document.getElementById("s1").value = "asdasd";

        estBtn = document.getElementById("estBtn");
        estBtn.onclick = function(){
          if (remind_change_confidence_slider()) {
            return;
          }

          document.getElementById("movedConfidenceSlider").textContent = "0";
          preRecommendationConfidence = document.getElementById('teamConfValue').value;
          console.log("Human has submitted the estimation input boxes by clicking submit. ")
          gTimeStamp2 = new Date(); //this is when user clicks the submit button;

          gEstimations=inputEstimation(); //obtain the input values
          if(gEstimations!==undefined){
            // hide human input value, select btn & bar
            console.log("human input estimation input boxes has been verified.")
            document.getElementById("estimation").style.display="none";
            document.getElementById("recommendationMessage").innerHTML = message;
            // document.getElementById("rangebarContainer").style.display="none";
			      console.log("gCurrentPlayer: " + gCurrentPlayer);
            var T = getSkillValue(gCurrentPlayer); // Why is there a minus 1 here? Martin: Removed the minus temporarily so the ApplyT function has the right parameter.
            adjustedPriors = applyT(T, gPriors);

            adj_max = getAdjMax(adjustedPriors);
            est_max = getEstMax(gEstimations);
            est_max_index = est_max[1];
            adj_max_index = adj_max[1];
            for (var i = 0; i < 7; i++) {
              adjustedPriors[i] = Math.round(adjustedPriors[i] * 100);
            }
			// Flip the recommendation if the recommendation is exactly the symmetric one of the user's choice 
			console.warn("EST MAX: "+ est_max_index);
			console.warn("ADJ MAX:" + adj_max_index);
			if (isSymmetric && (est_max_index == 6- adj_max_index) && (est_max_index != adj_max_index)){
				console.warn("Need to Flip!")
				var newPrior = new Array();
				for (var i=0; i<7;i++){
					newPrior[i] = adjustedPriors[6-i];
				}
				adjustedPriors = newPrior
			
				// Recalculate the priors if flipped
	            adj_max = getAdjMax(adjustedPriors);
	            est_max = getEstMax(gEstimations);
	            est_max_index = est_max[1];
	            adj_max_index = adj_max[1];
			}

            // This checks if the human and the recommender disagree
			if (agentType == "none"){
              gStep+=1;
              sendData(-1).then(function(response){
                //gPriors = null;
                message = "";
                UIclear();
                // gTimeStamp2=null;
                // gTimeStamp1=null;
                addNewDisc(est_max_index);
              }).catch(function (error){
                console.log("sendData(-1) error "+error);
              });
            }
            // else if(est_max_index!==adj_max_index){
			else{
              //show machine scores & select btn & result
              console.log("System detects a difference between user's input estimation boxes max and agent model's prediction max.")
              document.getElementById("scores").style.display=""; //changed
              document.getElementById("recommendationMessage").style.display=document.getElementById("displayRecommenderMessage").textContent;
              // document.getElementById("recommendationMessage").style.display="none";
              document.getElementById("estimation").style.display="";
              document.getElementById("scoSelectBtn").style.display=""; //changed from none
              document.getElementById("scoSelectBtn").value="AI Advice";
              document.getElementById("scoSelectBtn").disabled = true;
              document.getElementById("scoSelectBtn").style.opacity="1"; //added for full opacity
              document.getElementById("agreeBtn").style.display="none";
              //document.getElementById("estimation").style.disabled=true;
              document.getElementById("estBtn").style.display="none";
              document.getElementById("probabilityChart").style.display="none";  
              document.getElementById("estSelectBtn").style.display="";
              gTimeStamp3=new Date();

              // Update the chart values to reflect the recommendation
              chart.data.datasets[0].data = adjustedPriors;
              chart.update()

              var rankArray = getRank(gPriors);
              for (var i = 0; i < 7; i++) {//compute every col's win's percentage
                document.getElementById('s'+ i).style="background-color:#fff";
                if (agentType == "probability"){
			    	      document.getElementById('s' + i).textContent = adjustedPriors[i]+ "%";
                  document.getElementById("probabilityChart").style.display="";  

			          }

                if (agentType == "discrete"){
                  document.getElementById('s' + i).textContent = "";
                }
                
                if (agentType == "rank"){
                  if (rankArray[i] > 3){
                    document.getElementById('s' + i).textContent = "";
                    } 
                  else {
                    document.getElementById('s' + i).textContent = "#" + rankArray[i];
                    }
                }
                
                  // document.getElementById('s' + i).textContent = "#" + rankArray[i];
                }

                if (agentType == "probability"){
                  document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
                }
                if (agentType == "discrete"){
                  document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
                  document.getElementById('s'+ adj_max_index).textContent="X";
                }
                if (agentType == "rank"){
                  document.getElementById('s'+ adj_max_index).style="background-color:#03c03c";
                }

                //stress the biggest one probability
                // document.getElementById('s'+ adj_max_index).style="background-color:green";
			  	document.getElementById('e'+ est_max_index).style="background-color:#03c03c";
			  	document.getElementById('s' + i).disabled=true;
			  	document.getElementById('e' + i).disabled=true;
          }

			  if(est_max_index==adj_max_index){
			  	document.getElementById("scoSelectBtn").style.display=""; //changed from none
			  	document.getElementById("estSelectBtn").style.display="Final Choice.";
			  	document.getElementById("agreeBtn").style.display="none";
			    }
          }else{
            console.log("user input estimation boxes can't pass the verification. ")
            return;
          }
        }
      }else{
        //if it is computer playing
        addNewDisc(0);
        gPriors = null;
        message = "";
      }
    }
  }
});//the end of the transitioned fuction
}//the end of the drop disc function

function sendData(selection){
  console.log("senddata in");
  var timeOfHumanChoice = (gTimeStamp2.getTime() - gTimeStamp1.getTime())/1000;
  //var secondsold = Math.floor(timeold / 1000)
  var timeOfSwitchSelection=0;
  if (selection!==-1){
    timeOfSwitchSelection = (gTimeStamp4.getTime() - gTimeStamp3.getTime())/1000;
  }
  
  console.warn(optimumAdjustedPriors);
  console.log("sending ajax...");
  // console.warn(assignedGroup);
  return axios.post('/play/newMove',{
    gGameId: gGameId,
    teamConfValue: document.getElementById('teamConfValue').value,
    humanConfValue: preRecommendationConfidence,
    timeOfHumanChoice : timeOfHumanChoice,
    timeOfSwitchSelection, 
    humanChoice : humanFirstChoice,
    teamChoice: gEstimations,
    yellowChoice:adjustedPriors, 
    yellowValue: Math.round(100*value),
    yellowMessage : message,
    optimumChoice: optimumAdjustedPriors,
    optimumValue: Math.round(100*optimumValue),
    optimumMessage : optimumMessage,
    selection: selection,
    redGeneration: gModels[0],
    redSetting: document.getElementById('Skill1').value,
    yellowGeneration: gModels[1],
    yellowSetting: document.getElementById('Skill2').value, 
    gStep: gStep,
    assignedGroup: assignedGroup,
    movesSinceLastChange: parseInt(document.getElementById("movesSinceLastChange").textContent),
  });
}

function sendGameData(){
  console.log("sendGameData in");
   var totalTime=(gTimeStamp5.getTime() - gTimeStamp0.getTime())/1000; 
   console.log("sending game ajax...")
   return axios.post('/play/nextGame',{
       gGameId: gGameId,
       gOutcome : gOutcome, 
       totalTime: totalTime, 
       humanToAgentTrust: $('input[name="optradio"]:checked').val(), 
       humanToHimselfTrust: $('input[name="yourselfRadio"]:checked').val(),
       attribute: $('input[name="attributeRadio"]:checked').val(),
       redModel:gModels[0], 
       redSkill:document.getElementById('Skill1').value,
       yellowModel:gModels[1],
       yellowSkill: document.getElementById('Skill2').value,
   	   assignedGroup: assignedGroup,
  });
}

$("#scoSelectBtn").click(function(){
  if (remind_change_confidence_slider()) {
    return;
  }
  gTimeStamp4=new Date();
  console.log("I'm in scoSelectBtn!");
  gStep+=1;
  humanFirstChoice=gEstimations;
  sendData(0).then(function (response){
    addNewDisc(adj_max_index);
  })
  .catch(function (error){
    console.log("sendData(0) error "+error);
  });
  document.getElementById('e'+ est_max_index).style="background-color:transparent";
  document.getElementById('s'+ adj_max_index).style="background-color:transparent";
  UIclear();
  message = "";
});

$("#agreeBtn").click(function(){
  if (remind_change_confidence_slider()) {
    return;
  }
  gTimeStamp4=new Date();
  console.log("Clicked on agree button!");
  gStep+=1;
  humanFirstChoice=gEstimations;
  sendData(-1).then(function (response){
    addNewDisc(adj_max_index);
  })
  .catch(function (error){
    console.log("sendData(0) error "+error);
  });
  //addNewDisc(adj_max_index);
  document.getElementById('e'+ est_max_index).style="background-color:transparent";
  document.getElementById('s'+ adj_max_index).style="background-color:transparent";
  UIclear();
  message = "";
});

$("#estSelectBtn").click(function(){
  if (remind_change_confidence_slider()) {
    return;
  }
  gTimeStamp4=new Date();
  console.log("I'm in estSelectBtn!");
  humanFirstChoice=gEstimations; // Sometimes human will select something different first
  gEstimations = inputEstimation();
  est_max = getEstMax(gEstimations);
  est_max_index = est_max[1];
  gStep+=1; 
  sendData(1).then(function(response){
     addNewDisc(est_max_index);
  })
  .catch(function (error){
    console.log("sendData(1) error "+error);
  });
  document.getElementById('e'+ est_max_index).style="background-color:transparent";
  document.getElementById('s'+ adj_max_index).style="background-color:transparent";
  document.getElementById("estSelectBtn").value = "Final choice.";
  // document.getElementById("estSelectBtn").disabled = true;
  UIclear();
  message = "";
});

$("#dropBtn").click(function(){
  console.log("Drop button clicked");
  if (remind_change_confidence_slider()) {
    return;
  }
  gEstimations = inputEstimation();
  if (gEstimation != undefined)
  gTimeStamp2 = new Date(); //this is when user clicks the submit button;
  gTimeStamp4 = new Date();
  document.getElementById("estimation").style.display="none";
  var T = getSkillValue(gCurrentPlayer); // Why is there a minus 1 here? Martin: Removed the minus temporarily so the ApplyT function has the right parameter.
  adjustedPriors = applyT(T, gPriors);
  adj_max = getAdjMax(adjustedPriors);
  est_max = getEstMax(gEstimations);
  est_max_index = est_max[1];
  adj_max_index = adj_max[1]
  humanFirstChoice=gEstimations;
  gStep+=1;
  sendData(-1).then(function (response){
    addNewDisc(est_max_index);
  })
      .catch(function (error){
        console.log("sendData(0) error "+error);
      });
  UIclear();
  message = "";
});

/**
 * Version 6.x: For the rank representation of the recommender
 * This function gets the rank of the recommended value
 */
function getRank(adjustedPriors){
  var sorted = adjustedPriors.slice().sort(function(a,b){return b-a})
  var ranks = adjustedPriors.slice().map(function(v){ return sorted.indexOf(v)+1 });
  return ranks;
}

function getAdjMax(adjustedPriors){
  var adj_max = new Array(adjustedPriors[0],0);
  for(var i=1;i<7;i++){
    if(adjustedPriors[i]>adj_max[0]){
      adj_max[0]=adjustedPriors[i];
      adj_max[1]=i;
    }
  }
  return adj_max;
}

function getEstMax(estimations){
  console.log("Martin: " + estimations)
  var est_max = new Array(estimations[0],0);
  for(var i=1;i<7;i++){
    if(estimations[i]>est_max[0]){
      est_max[0]=estimations[i];
      est_max[1]=i;
    }
  }
  console.log("Martin: " + est_max);
  return est_max;
}

/**
 * Version 6.x
 * Input now only has a discrete choice instead of probabilities
 */

function inputEstimation() {
  let estimations = new Array();
  for (let i = 0; i < 7; i++) {
    // Push 100 if selected
    if (document.getElementById('e' + i).value == "X") {
      if (possibleColumns().indexOf(i) != -1) {
        estimations.push(100);
      }
      // alert user choice not possible
      else {
        alert("Cannot drop at that column!")
      }
    }
    // Push 0 if not selected
    else{
      estimations.push(0);
    }
  }
  console.log("Martin: estimation is " + estimations)
  return estimations;
}

function changePlayer() {
  gCurrentPlayer = 3 - gCurrentPlayer;
  console.log("play has been switches.")
}

// this is the function that adds a brand new disc into the html and will let it go to where it should be
function addNewDisc(col) {
  console.log("addNewDisc function working now, adding new disc to column: "+col);
  var disc = new Disc(gCurrentPlayer, col);
  disc.addToScene();
  // automatically drop;
  // disc.drop();
  // gDiscs.push(disc);
  setTimeout(()=>{
    disc.drop();
    gDiscs.push(disc);
    // return disc;
  },100);
}

function prepareField() {
  gGameField = new Array();
  for (var i = 0; i < 6; i++) { // 6 rows;
    gGameField[i] = new Array();
    for (var j = 0; j < 7; j++) { // 7 columns;
      gGameField[i].push(0);
    }
  }
}

function animateDiscDrop(who, where) {
  console.log(who +" is now animately dropping");
  var element = document.getElementById(who);
  // Run async to allow page to render. Otherwise it's possible that the disc
  // creation and position update happen in the same JS cycle, preventing the
  // transition from firing.
  setTimeout(function(element) {
    element.style.top = where + 'px';
  }, 0, element);
  //the element withbthe right position now will be returned
  return element;
}

// This is a funvtion that hides all machine distrubution, user input boxes...etc
function UIclear(){
  //hide machine scores, scoSelectBtn,results
  if (agentType == "none") {
    document.getElementById("scores").style.display="none"; //added
    document.getElementById("scoSelectBtn").style.display="none"; // added
  }
  else {
    document.getElementById("scores").style.display=""; //added
    document.getElementById("scoSelectBtn").style.display="none"; // added
  }
  // document.getElementById("result").style.display="none";
  //hide estimation
  document.getElementById("estimation").style.display="";
  document.getElementById("rangebarContainer").style.display="none";
  document.getElementById("agreeBtn").style.display="none";
  document.getElementById("estBtn").disabled = true;
  document.getElementById("dropBtn").disabled = true;
  document.getElementById("estBtn").value = "Select a column to drop.";
  document.getElementById("dropBtn").value = "Select a column to drop.";
  document.getElementById("dropBtn").style.display="none";
  document.getElementById("probabilityChart").style.display="none";  
  document.getElementById("scores").style.display="";
  document.getElementById("recommendationMessage").style.display="none";
  document.getElementById("selectedColumn").textContent = "0";

  // If recommends first, clear selection
  for (var i = 0; i < 7; i++) {
    document.getElementById("e" + i).value = "";
    document.getElementById('e' + i).style = "background-color:transparent";
    document.getElementById("s" + i).value = "";
    document.getElementById("s" + i).textContent = " ";
    document.getElementById('s' + i).style = "background-color:transparent";
  }
}

//this is a function that sets all user input boxes to original status waiting to be input again
function UIreset(){
  for (let i = 0; i < 7; i++) {
    document.getElementById('e' + i).value=" ";
    document.getElementById('e' + i).disabled = false;
    document.getElementById('e' + i).style = "background-color:transparent";
    // document.getElementById("confidence"+i).value = 0;
    // document.getElementById("confidence"+i).disabled = false;
    document.getElementById("rangebarContainer").style.display="none";
    document.getElementById("agreeBtn").style.display="none";  
    document.getElementById("scoSelectBtn").style.display="none";
    $('input[type="range"]').val(0).change();
  }
}

document.onkeydown=EventOper;
function EventOper(){
  if(event.keyCode==17){
    event.keyCode=0;
    event.returnValue=false;
  }
  if(event.keyCode==91){
    event.keyCode=0;
    event.returnValue=false;
  }
  if(event.keyCode==187){
    event.keyCode=0;
    event.returnValue=false;
  }
  if(event.keyCode==189){
    event.keyCode=0;
    event.returnValue=false;
  }
  if(event.ctrlKey){    
    event.returnValue=false;
  }
}

// Check if the current board is symmetric (even the color has to be symmetric as well)
function is_symmetry(b){
	// Check the first part of the map (only one color)
	for (var i=0; i<42; i+=7){
		if (b[i]!=b[i+6] || b[i+1]!=b[i+5] || b[i+2]!=b[i+4]){
			return false;
		}
	}
	
	for (var i=42; i<84; i+=7){
		if (b[i]!=b[i+6] || b[i+1]!=b[i+5] || b[i+2]!=b[i+4]){
			return false;
		}
	}
	return true;
}

function remind_change_confidence_slider(){
  let movesSinceLastChange = parseInt(document.getElementById("movesSinceLastChange").textContent);
  if (movesSinceLastChange > 2) {
    alert("Please ensure that you update your estimate on who will win (red/yellow range bar)");
    return true;
  } else {
    document.getElementById("movesSinceLastChange").textContent=
        (movesSinceLastChange + 1).toString();
    return false;
  }
}