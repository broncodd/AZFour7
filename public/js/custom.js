// function sliderChange(object) {
//     var eContent = document.getElementById("e"+object.id.charAt(10));
//     var osliderBlock = document.getElementById(object.id);
//     var curSum = document.getElementById("currentSumProbability");
//     eContent.value=osliderBlock.value;
//     var sum=0;
//     var otherSum = 0; // This tracks the sum of all the other cells
//     for (var i=0; i<7; i++){
//         var inputBox="e"+i;
//         var inputBoxValue = document.getElementById(inputBox).value.trim();
//         if (inputBoxValue===""){
//             inputBoxValue=0;
//         }
//         if (inputBoxValue==="FULL"){
//             inputBoxValue=0;
//         }
//         sum+=parseFloat(inputBoxValue);
//         if (i != object.id.charAt(10)){
//             otherSum += parseFloat(inputBoxValue);
//         }
//         console.warn(sum);
//     }
//     if (sum>100){
//         // alert("exceed 100%");
//         // eContent.value=0;
//         // osliderBlock.value=0;
//         eContent.value=100 - otherSum;
//         osliderBlock.value=100 - otherSum;
//         sum = 100;
//     }
//     if (sum == 100){
//         document.getElementById("estBtn").disabled = false;
//     }else{
//         document.getElementById("estBtn").disabled = true;
//     }
//     curSum.innerHTML = "Current sum probability: " + sum;
// }


// function inputBoxChange(object) {
//
//     var eContent = document.getElementById(object.id);
//
//     if (isNaN(eContent.value.trim())){
//         alert("input not a number");
//         eContent.value=0;
//         return;
//     }
//
//     if (eContent.value.trim()<0){
//         alert("input lower than 0");
//         eContent.value=0;
//         return;
//     }
//
//     if (eContent.value==""){
//         eContent.value=0;
//         return;
//     }
//
//     var osliderBlock = document.getElementById("confidence"+object.id.charAt(1));//滑块的值
//
//     var sum=0;
//     for (var i=0; i<7; i++){
//         var inputBoxValue = document.getElementById("e"+i).value.trim();
//         if (inputBoxValue===""){
//             inputBoxValue=0;
//         }
//         sum+=parseFloat(inputBoxValue);
//     }
//
//     if (sum>100){
//         alert("exceed 100%");
//         eContent.value=0;
//         osliderBlock.value=0;
//     }
//
//
//     osliderBlock.value=eContent.value ;//将玩家总人数赋值给滑块的值，实现动态变化
//     //callback(document.getElementById("confidence"+object.id));
// }

/**
 * Version 6.x
 * Changed the logic of submission
 * Now user only needs to click on the button to make choice
 * Instead of using slider to submit probabilities
 * @param object
 */
function onUserClick(object) {

    // Set the object green and X to indicate user has selected
    object.style="background-color:#03c03c";
    object.value="X";

    // Reset any other object to blank status
    for (let i=0; i<7; i++) {
        if (("e" + i) != object.id && document.getElementById("e"+i).value != "FULL" ) {
            document.getElementById("e" + i).value = "";
            document.getElementById("e" + i).style="background-color:white";
        }
    }

    // Change the text of submit button to help user
    // Enable to submit button and the drop button
    if (document.getElementById("movedConfidenceSlider").textContent == "1") {
        document.getElementById("estBtn").disabled = false;
    }
    document.getElementById("selectedColumn").textContent = "1";
    document.getElementById("estBtn").value = "Drop at Column " + (parseInt(object.id.substring(1)) + 1);
    document.getElementById("dropBtn").disabled = false;
    document.getElementById("dropBtn").value = "Drop at Column " + (parseInt(object.id.substring(1)) + 1);
}