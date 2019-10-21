function onradioChange(e) {
var isageChecked = document.getElementById("ageyes").checked;
var isreadChecked = document.getElementById("readyes").checked;
var isdataChecked = document.getElementById("datayes").checked;

document.getElementById("agree").disabled = !(isageChecked&&isdataChecked&&isreadChecked)
//document.getElementById("decline").hidden = !(isageChecked&&isdataChecked&&isreadChecked)
}