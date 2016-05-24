var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base64Img = require('base64-img');

var PORT = 3000;
var HOST = '127.0.0.1';

// route to index.html
app.use('/', express.static(__dirname + '/public'));
app.use('/stream', express.static(__dirname + '/stream'));

io.on('connection', function(socket) {
    console.log("connected");
    socket.on('liveStream', function(data) {
        console.log("GOT data");
        io.emit('imgRender', data);
        var imgDat = 'data:image/jpg;base64,' + data.buffer.toString();
        base64Img.imgSync(imgDat, './stream', 'cam1');
    });
});

http.listen(PORT, function() {
    console.log('listening on ' + HOST + ' port ' + PORT);
});
