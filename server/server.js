const http = require('http');
const express = require('express');
const app = express();
var server = =app.listen(8080)
let port=Number(process.env.PORT || 8080);
let server = app.listen(port);
var io = require('socket.io').listen(server);

const RpsGame = require('./rps-game');

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));
console.log("My socket server is running on port " + port);

// const server = http.createServer(app);

// const io = socketio(server);+

// Start socket.io
let socket = require('socket.io');

// Connect it to the web server
let io = socket(server);

let waitingPlayer = null;

io.sockets.on('connection', (sock) => {

  if (waitingPlayer) {
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

//server.on('error', (err) => {
//  console.error('Server error:', err);
//});

//server.listen(8080, () => {
//  console.log('RPS started on 8080');
//});
