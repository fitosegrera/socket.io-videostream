var exec = require('child_process').exec;
var onFileChange = require('on-file-change');
var path = require('path');
var fs = require('fs');
var io = require('socket.io-client');
var urlToStream = "http://192.168.0.103:3000";
var serv_io = io.connect(urlToStream, { reconnect: true });

var id = process.argv[2];

if (id == 'cam1' || id == 'cam2' || id == 'cam3') {
    console.log("Streaming with ID: " + id);
} else {
    console.log("ERROR: incorrect or missing argument. Please use cam1, cam2 or cam3");
    console.log(id);
    process.exit();
}

var sockets = {};

serv_io.on('connect', function(socket) {
    console.log("connected");
});

serv_io.on('disconnect', function() {

});

serv_io.on('start-stream', function() {
    startStreaming(serv_io);
});

var command = "raspistill --nopreview -w 600 -h 500 -co 40 " +
    "-q 5 -o ./stream/" + id + ".jpg -tl 100 -t 0 -th 0:0:0";

exec(command, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});

console.log('Watching for changes...');
console.log("Streaming image data: OK");

onFileChange('./stream/' + id + '.jpg', function() {
    fs.readFile('./stream/' + id + '.jpg', function(err, buf) {
        serv_io.emit('liveStream', { image: true, buffer: buf.toString('base64') });
        //console.log(index + ". data sent!");
    });
});
