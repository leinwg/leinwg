const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = '${__dirname}/../client';
console.log('Serving static from ${clientPath}');

app.use(express.static(clientPath));
app.use(express.static('../client'));
app.get('/', function(req, res, next) {
    res.send("Hello world");
});

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer;

io.on('connection', onConnection);

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});

function onConnection(sock) {
    console.log('Someone connected');
    sock.emit('message', 'Hi, you are connected');
    sock.on('message', (text) => io.emit('message', text));
    
    if (waitingPlayer) {
        // Match starts
        io.emit('message', 'Match starts');
        waitingPlayer = null;
    } else {
        waitingPlayer = sock;
        sock.emit('message', 'You are waiting for a second player');
    }
};
