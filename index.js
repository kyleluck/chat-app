var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('chat message', {user: 'System', msg: 'a user connected...'});

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  //emit when a user is typing
  socket.on('typing state change', function(msg) {
    io.emit('typing state change', msg);
  });

  socket.on('disconnect', function() {
    io.emit('chat message', {user: 'System', msg: 'a user disconnected...'});
  });
});

http.listen(3001, function() {
  console.log('Listening on port 3001...');
});
