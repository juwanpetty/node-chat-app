const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', socket => {
  console.log('New user connected...');

  socket.on('disconnect', () => {
    console.log('Disconnected from the client...');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});