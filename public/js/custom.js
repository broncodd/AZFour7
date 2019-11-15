  function sliderChange(object) {
    var eContent = document.getElementById("e"+object.id.charAt(10));
    var osliderBlock = document.getElementById(object.id);
	var curSum = document.getElementById("currentSumProbability");
    eContent.value=osliderBlock.value;
    var sum=0;
	var otherSum = 0; // This tracks the sum of all the other cells 
    for (var i=0; i<7; i++){
      var inputBox="e"+i;
      var inputBoxValue = document.getElementById(inputBox).value.trim();
      if (inputBoxValue===""){
        inputBoxValue=0;
	 }
      if (inputBoxValue==="FULL"){
        inputBoxValue=0;
      }
      sum+=parseFloat(inputBoxValue);
	  if (i != object.id.charAt(10)){
	  	otherSum += parseFloat(inputBoxValue);
	  }
      console.warn(sum);
    }
    if (sum>100){
      // alert("exceed 100%");
      // eContent.value=0;
      // osliderBlock.value=0;
      eContent.value=100 - otherSum;
      osliderBlock.value=100 - otherSum;
	  sum = 100;
    }
	curSum.innerHTML = "Current sum probability: " + sum;
  }

  // function sliderChange(e) {
  //   const selectedValue = e.value;
  //   const maxValue = parseInt(e.getAttribute("max"));
  //   const allSliders = document.getElementsByClassName("myslider");
  //      // console.log();

  //      const slidersArr = Array.from(Array(allSliders.length).keys());

  //      slidersArr.forEach(sliderIndex => {
  //       const currentSlider = allSliders[sliderIndex];
  //       if (currentSlider.id !== e.id) {
  //         if (parseInt(currentSlider.getAttribute("max"))<=maxValue){
  //           currentSlider.setAttribute("max",String(maxValue-selectedValue)); 
  //         }
          
  //       }
  //       else {
  //         document.getElementById("e"+currentSlider.id.replace("confidence","")).value = selectedValue;   
  //       }


  //      });
  // }



  function inputBoxChange(object) {

    var eContent = document.getElementById(object.id);

    if (isNaN(eContent.value.trim())){
       alert("input not a number");
       eContent.value=0;
       return;
    }

      if (eContent.value.trim()<0){
       alert("input lower than 0");
       eContent.value=0;
       return;
    }

    if (eContent.value==""){
       eContent.value=0;
       return;
    }

    var osliderBlock = document.getElementById("confidence"+object.id.charAt(1));//滑块的值

    var sum=0;
    for (var i=0; i<7; i++){
      var inputBoxValue = document.getElementById("e"+i).value.trim();
      if (inputBoxValue===""){
        inputBoxValue=0;
      }
      sum+=parseFloat(inputBoxValue);
    }

    if (sum>100){
      alert("exceed 100%");
      eContent.value=0;
      osliderBlock.value=0;
    }


    osliderBlock.value=eContent.value ;//将玩家总人数赋值给滑块的值，实现动态变化
    //callback(document.getElementById("confidence"+object.id));
  }
