var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

io.on('connection',(socket) => {
    console.log("User connection");
    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
    socket.on('chat message', (msg) =>{
        io.emit('chat message', msg);
    });
});

server.listen(2000,ip, () => {
    console.log("Listening on server 2000");
});