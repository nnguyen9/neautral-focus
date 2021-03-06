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

/*================Creating a canvas=================*/
var canvas;         //This is the OpenGL canvas
var imgcanvas;      //This is the canvas in the html
var numVertices;    //Number of vertices we want to collect
var gl; 
      
/*==========Defining and storing the geometry=======*/

$(document).ready(function() {

    //Heatmap variables
    var predictionPoints = []
    canvas = document.getElementById('glCanvas')
    imgcanvas = document.getElementById('myCanvas')

    //Define collection time here
    numVertices = 100;
    gl = canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
    var xin;
    var yin;

    // Here is where we put to run after the document has loaded
    var ctx = imgcanvas.getContext('2d');
    var img = new Image();

    var calibrating = false;

    // Loads the initial image
    loadImage = function(src){

        img.crossOrigin = '';
        img.src = src + "?" + new Date().getTime();

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            imgcanvas.width = img.width;
            imgcanvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
    }

    loadImage(Global.static_test_image);

    //Loop for data collection
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            if (calibrating) {
                return;
            }
            if (predictionPoints.length < 3 * numVertices) {
                if(data != null) {
                    if(data.x < imgcanvas.width && data.y < imgcanvas.height)
                    {
                        //standardize x and y coordinates
                        xin = (data.x - (imgcanvas.width / 2)) / (imgcanvas.width / 2) 
                        yin = -(data.y - (imgcanvas.height / 2)) / (imgcanvas.height / 2) 

                        predictionPoints.push(xin)
                        predictionPoints.push(yin)
                        predictionPoints.push(0)
                    }
                }
            } 
            else if(predictionPoints.length == 3 * numVertices)
            {
                //Stop gathering points to render scene
                webgazer.pause()

                //Do Rendering
                // Create an empty buffer object to store the vertex buffer
                var vertex_buffer = gl.createBuffer();

                //Bind appropriate array buffer to it
                gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
              
                // Pass the vertex data to the buffer
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(predictionPoints), gl.STATIC_DRAW);

                // Unbind the buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, null);


                /*=========================Shaders========================*/
              
                // vertex shader source code
                var vertCode =
                    'attribute vec3 coordinates;' +
                        
                    'void main(void) {' +
                       ' gl_Position = vec4(coordinates, 1.0);' +
                       'gl_PointSize = 75.0;'+
                    '}';
                 
                // Create a vertex shader object
                var vertShader = gl.createShader(gl.VERTEX_SHADER);

                // Attach vertex shader source code
                gl.shaderSource(vertShader, vertCode);

                // Compile the vertex shader
                gl.compileShader(vertShader);

                // fragment shader source code
                var fragCode =
                    'void main(void) {' +
                       ' gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' +
                    '}';
                 
                // Create fragment shader object
                var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

                // Attach fragment shader source code
                gl.shaderSource(fragShader, fragCode);
              
                // Compile the fragmentt shader
                gl.compileShader(fragShader);

                // Create a shader program object to store
                // the combined shader program
                var shaderProgram = gl.createProgram();

                // Attach a vertex shader
                gl.attachShader(shaderProgram, vertShader); 
         
                // Attach a fragment shader
                gl.attachShader(shaderProgram, fragShader);

                // Link both programs
                gl.linkProgram(shaderProgram);

                // Use the combined shader program object
                gl.useProgram(shaderProgram);

                /*======== Associating shaders to buffer objects ========*/

                // Bind vertex buffer object
                gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

                // Get the attribute location
                var coord = gl.getAttribLocation(shaderProgram, "coordinates");

                // Point an attribute to the currently bound VBO
                gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

                // Enable the attribute
                gl.enableVertexAttribArray(coord);

                /*============= Drawing the primitive ===============*/

                // Clear the canvas
                gl.clearColor(1.0, 1.0, 1.0, 0.0);

                // Enable the depth test
                gl.enable(gl.DEPTH_TEST);
         
                // Clear the color buffer bit
                gl.clear(gl.COLOR_BUFFER_BIT);

                // Set the view port
                gl.viewport(0,0,canvas.width,canvas.height);

                // Draw the triangle
                gl.drawArrays(gl.POINTS, 0, numVertices);

                combineImages()
            }
            else {
                //This shouldn't happen
                // webgazer.pause()
                console.log('SOMETHING BAD HAPPENED')
            }
        })
        .showPredictionPoints(true); // shows a square every 100 milliseconds where current prediction is 

    var first = true

    var combineImages = function() {
        // Gets data url for mask
        imageUrl = canvas.toDataURL().replace("data:image/png;base64,", "");

        // Passes the mask to backennd to be saved
        $.post(Global.save_image_url, {
            csrfmiddlewaretoken: Global.csrf_token,
            image: imageUrl,
            file_name: "test_mask.png"
        }, function(data) {
            console.log(data)
        })

        // Pass images for combining
        $.post(Global.combine_images_url, {
            csrfmiddlewaretoken: Global.csrf_token,
            image_file: first ? "test_resized.png" : "iterable3.png",
            mask_file: "test_mask.png"
        }, function(data) {
            console.log("Image combined!")
            loadImage(Global.static_iterable)

            first = false
            predictionPoints = []
            webgazer.resume()
        })        
    }
    
    $('button#start-button').click(function() {
        webgazer.resume()
    });

    $('button#stop-button').click(function() {
        webgazer.pause()
    });    

    $('button#calibrate-button').click(function() {
        if (calibrating) {
            // Stop calibrating
            $(this).text('Start Calibration')

            webgazer.pause()

            calibrating = false
            $('div#calibration-div').hide()
        } else {
            // Start calibration
            $(this).text('Stop Calibration')

            calibrating = true;

            webgazer.begin()
            $('div#calibration-div').show()
        }
    });
});


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}


         
