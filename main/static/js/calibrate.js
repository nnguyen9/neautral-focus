$(document).ready(function() {
    //Loop for data collection
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
        	// console.log(data)
        })
        .begin()
        .showPredictionPoints(true); // shows a square every 100 milliseconds where current prediction is 

    var count = 0;
    var numDots = 36;
    $('.circle').click(function() {
      $(this).css('visibility', 'hidden')

      count++;
      console.log("COunt: " + count)
      if (count >= numDots) {
      	console.log("Count hit!")
      	window.location.href = Global.index_url
      }
    })
});


window.onbeforeunload = function() {
    webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    // window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}


         
