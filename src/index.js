// Node, Express and npm modules
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

// App modules
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

// Configurations
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New websocket connection!');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.username} has joined!`)
      );
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (sentMessage, callback) => {
    const filter = new Filter();
    if (filter.isProfane(sentMessage)) {
      return callback('Profanity is not allowed!');
    }

    const user = getUser(socket.id);

    if (!user) {
      return callback('Cannot send your message!');
    }

    io.to(user.room).emit(
      'message',
      generateMessage(user.username, sentMessage)
    );
    callback();
  });

  socket.on('sendLocation', (sentLocation, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback('Cannot send your location!');
    }

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${sentLocation.latitude},${sentLocation.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const disconnectedUser = removeUser(socket.id);

    if (disconnectedUser) {
      io.to(disconnectedUser.room).emit(
        'message',
        generateMessage('Admin', `${disconnectedUser.username} has left!`)
      );
      io.to(disconnectedUser.room).emit('roomData', {
        room: disconnectedUser.room,
        users: getUsersInRoom(disconnectedUser.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Node.js server running on port ${port}...`);
});
