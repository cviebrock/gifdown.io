var http = require('http');
var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

const PORT = 8080;

const BGCOLOR = '#373a3c';
const FGCOLOR = '#ffffff';
const IMG_WIDTH = 200;
const IMG_HEIGHT = 50;

// Create server
var server = http.createServer(handleRequest);

// Start server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});


// Handle requests
function handleRequest(req, res) {

    var fileName = req.url.split('?')[0],
        pattern = /\/i\/(\d{2})\/(\d{2})\/(\d{2})\.gif$/,
        matches = fileName.match(pattern);

    fs.readFile(fileName, function (err, data) {
        if (err) {

            if (!matches) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Nope!');
            } else {

                buildGif(matches[1], matches[2], matches[3]);

                res.writeHead(503, {'Content-Type': 'text/plain', 'Retry-After': 10});
                res.end('Generating...');
            }
        } else {
            // shouldn't get to here as nginx will catch it
            res.setHeader('Content-Type', 'image/gif');
            res.end(data);
        }
    });

}


// build the gif
function buildGif(hours, minutes, seconds) {

    var sprintf = require('sprintf-js').sprintf;
    var mkdirp = require('mkdirp');
    var Gifsicle = require('gifsicle-stream'),
        gifProcessor = new Gifsicle(['-w', '-O3', '--no-loopcount']);

    var startTime = new Date().getTime();

    // check path exists
    var path = sprintf('storage/i/%02d/%02d', hours, minutes),
        fileName = sprintf('%s/%02d.gif', path, seconds);


    console.log('Checking directory: ' + path);

    mkdirp(path, function (err) {
        if (err) {
            console.log(err)
        } else {

            var encoder = new GIFEncoder(IMG_WIDTH, IMG_HEIGHT);

// stream the results as they are available into gif file
// need to add gif optimization here

            var output = encoder.createReadStream().pipe(gifProcessor).pipe(fs.createWriteStream(fileName));

            encoder.start();
            encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
            encoder.setDelay(1000);  // frame delay in ms
            encoder.setQuality(20); // image quality. 10 is default.

// use node-canvas
            var canvas = new Canvas(IMG_WIDTH, IMG_HEIGHT),
                ctx = canvas.getContext('2d');

// setup
            // Some weirdness with loading custom fonts ...
            // @see https://github.com/Automattic/node-canvas/issues/624
            var myFont = new Canvas.Font('Apercu', 'resources/fonts/apercu-mono-webfont.ttf');

            ctx.font = '36px Apercu';
            ctx.fillStyle = FGCOLOR;
            ctx.textBaseline = 'middle';

// loop for interval

            while (true) {

                // background
                ctx.fillStyle = BGCOLOR;
                ctx.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT);

                var textToDraw = sprintf('%02d:%02d:%02d', hours, minutes, seconds);

                var tWidth = ctx.measureText(textToDraw).width,
                    x = (IMG_WIDTH - tWidth) / 2;

                ctx.fillStyle = FGCOLOR;
                ctx.fillText(textToDraw, x, IMG_HEIGHT/2);
                encoder.addFrame(ctx);

                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                    if (minutes < 0) {
                        minutes = 59;
                        hours--;
                        if (hours < 0) {
                            break;
                        }
                    }
                }

            }

// end game

            encoder.setDelay(250);  // frame delay in ms

            for (var i = 3; i >= 0; i--) {
                ctx.fillStyle = BGCOLOR;
                ctx.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT);
                encoder.addFrame(ctx);

                if (i==0) {
                    encoder.setDelay(60000); // Skype is stoopid
                }

                ctx.fillStyle = FGCOLOR;
                ctx.fillText(textToDraw, x, IMG_HEIGHT/2);
                encoder.addFrame(ctx);
            }

            encoder.finish();

            var endTime = new Date().getTime(),
                ttb = (endTime - startTime) / 1000;
            console.log('Creating GIF: ' + fileName + ' [' + ttb + 's]');

            return output;
        }
    });

}

