const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { generateMessage, generateLocationMessage } = require('./utils/message');

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', socket => {
  console.log('New user connected...');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

  socket.on('createMessage', message => {
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the client...');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});