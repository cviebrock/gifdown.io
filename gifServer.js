var http = require('http');
var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

const PORT = 8080;

// Create server
var server = http.createServer(handleRequest);

// Start server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});



// Handle requests
function handleRequest(req, res) {
    console.log(req.url);
    //res.setHeader('Content-Type', 'image/gif');

    var fileName = 'my.gif';

    /*
    - generate the final filename : /i/123.gif
    - open the file
    - if it works:
        - spit it out
    - if it doesn't exist
        - generate it
        - spit it out
     */


    fs.readFile(fileName, function(err, data) {
        if (err) {
            //buildGif(fileName);
            res.end('Working...');
        } else {
            res.setHeader('Content-Type', 'image/gif');
            res.end(data);
        }
    });

}


// build the gifs
function buildGif(fileName) {

    var encoder = new GIFEncoder(320, 240);
// stream the results as they are available into myanimated.gif
    encoder.createReadStream().pipe(fs.createWriteStream(fileName));

    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(500);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

// use node-canvas
    var canvas = new Canvas(320, 240);
    var ctx = canvas.getContext('2d');

// red rectangle
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

// green rectangle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

// blue rectangle
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

    encoder.finish();
}


