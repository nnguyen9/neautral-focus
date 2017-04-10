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

$(document).ready(function() {
    var predictionPoints = []

    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            if (predictionPoints.length < 100) {
                predictionPoints.push(data)
            } else {
                webgazer.pause()
            }
        })
        .begin()
        .showPredictionPoints(true); // shows a square every 100 milliseconds where current prediction is 

    $('#prediction-button').click(function() {
        console.log(predictionPoints)
        predictionPoints = []
        console.log('Data points reset. Webgazer resumed')
        webgazer.resume()
    })

});


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}