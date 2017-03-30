// $(document).ready(function(){
// 	webgazer.begin()

// 	$("#prediction-button").click(function(){
// 		var prediction = webgazer.getCurrentPrediction();
// 		if (prediction) {
// 	    var x = prediction.x;
// 	    var y = prediction.y;
// 		  console.log("(" + x + ", " + y + ")") 
// 		} else {
// 			console.log("Prediction not found")
// 		}
// 	}) 

// });


window.onload = function() {
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
           console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
           console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .begin()
        .showPredictionPoints(true); // shows a square every 100 milliseconds where current prediction is 

    function checkIfReady() {
        if (webgazer.isReady()) {
            // setup();
            console.log("READY")
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);
};


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}