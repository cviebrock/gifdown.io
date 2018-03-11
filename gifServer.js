var http = require('http'),
    fs = require('fs'),
    cluster = require('cluster'),
    path = require('path');

const PORT = 8080;
const CHILD_PROCS = 4;

// Create server

if (cluster.isMaster) {
    for (var i = 0; i < CHILD_PROCS; i++) {
        cluster.fork();
    }
} else {
    var server = http.createServer(handleRequest);
    server.listen(PORT, function () {
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: http://localhost:%s", PORT);
    });
}


// Handle requests
function handleRequest(req, res) {

    var fileName = req.url.split('?')[0],
        pattern = /\/i\/(0[01])\/(\d{2})\/(\d{2})\.gif$/,
        matches = fileName.match(pattern);

    if (!matches) {
        var fileName = req.url.split('?')[0],
            pattern = /\/t\/(\d{10})\.gif$/,
            matches = fileName.match(pattern);
    
        if (!matches) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Nope!');
        }
        currentTime = Math.round((new Date()).getTime() / 1000);
        if(currentTime > matches[1]) {
            frames = 1
        }else {
            frames = matches[1] - currentTime;
        }
        

    } else {
        
        frames = (3600 * matches[1]) + (60 * matches[2]) + (1 * matches[3])
    }

    generateGif(frames, res)
}

function generateGif(frames, res) {

    var filePath = path.join(__dirname, 'resources', 'images', 'hour.gif');

        var readStream = fs.createReadStream(filePath),
            frameOffset = (3600 - frames),
            Gifsicle = require('gifsicle-stream'),
            gifsicleOptions = [
                '--conserve-memory',
                '--no-warnings',
                '--optimize=3',
                '--no-loopcount',
                '#' + frameOffset + '-'
            ],
            gifProcessor = new Gifsicle(gifsicleOptions);

        console.log(frames, frameOffset, gifsicleOptions);

        res.setHeader('Content-Type', 'image/gif');
        readStream.pipe(gifProcessor).pipe(res);

}
