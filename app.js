var express = require('express');
var randomName = require('node-random-name');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var socketList = {};

io.on('connection',(socket) => {
    socket.userName = randomName({first:true}) + "#" + Math.floor(Math.random() * 10000);
    socket.id = Math.random();
    socketList[socket.id] = socket;
    console.log("New conn " + socket.userName);
    io.emit('userEnter',socket.userName);
    socket.on('disconnect', () => {
        io.emit('userLeave', socket.userName);
    });
    socket.on('chat message', (msg) =>{
        if(msg !== ''){
            io.emit('chat message', {userName: socket.userName, msg});
        }
    });
});

server.listen(port,ip, () => {
    console.log("Listening on " + ip + ":" + port);
});