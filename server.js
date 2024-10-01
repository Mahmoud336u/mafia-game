const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the static HTML files
app.use(express.static(__dirname + '/public'));

let rooms = {}; // Store active game rooms and players

// Listen for client connections
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Join a game room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(socket.id);
    io.to(room).emit('playerJoined', rooms[room].length);

    // Handle game logic here, like assigning roles, starting rounds, etc.
  });

  // Handle player actions (e.g., voting, night actions)
  socket.on('playerAction', (data) => {
    io.to(data.room).emit('updateGameState', data);
  });

  // Disconnect from the game room
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
    // Handle room cleanup, game over, etc.
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
