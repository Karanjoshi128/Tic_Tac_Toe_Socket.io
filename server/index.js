const express = require('express');
const app = express();

const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server , {
  cors :{
    origin : "http://localhost:5173",
    methoids : ["GET", "POST"]
  }
});
let connectedUsers = 0;

io.on('connection', (socket) => {
  if (connectedUsers >= 2) {
    socket.emit('room-full'); // Notify the client that the room is full
    socket.disconnect(); // Disconnect the socket
    return;
  }

  connectedUsers++;
  console.log(`User connected. Total connected users: ${connectedUsers}`);

  // Handle user disconnection
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`User disconnected. Total connected users: ${connectedUsers}`);
  });

  // Handle other events, e.g., message handling
  socket.on('send-message', (data) => {
    socket.broadcast.emit('receive-message', data);
    socket.broadcast.emit('receive-message2', data);
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});