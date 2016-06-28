var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//on a get request, send index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// on any connection...
io.on('connection', function(socket) {

  //send user connected message to all users
  io.emit('chat message', {user: 'System', msg: 'a user connected...'});

  //when a chat message is received, send to all users (including sender)
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  //when a typing state changes for a user: send to everyone but sender
  socket.on('typing state change', function(msg) {
    socket.broadcast.emit('typing state change', msg);
  });

  //on user disconnect, send a message to all users
  socket.on('disconnect', function() {
    io.emit('chat message', {user: 'System', msg: 'a user disconnected...'});
  });
});

//listen on port 3001
http.listen(3001, function() {
  console.log('Listening on port 3001...');
});
