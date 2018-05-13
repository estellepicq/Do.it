const app = require('express')();
const server = require('http').createServer(app);
const path = require('path');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io').listen(server);

const port = process.env.PORT || 4000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

/* Root access */
app.use(serveStatic(__dirname + '/public/'));

/* API */
const todos = require('./routes/todos');
app.use('/todos', todos);

/* On /todolist */
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

/* listening */
io.sockets.on('connection', function (socket) {
  socket.on('addTodoServer', function (data) {
    io.sockets.emit('addTodoClient', data);
  });

  socket.on('deleteTodoServer', function (data) {
    io.sockets.emit('deleteTodoClient', data);
  });

  socket.on('updateTodoServer', function (data) {
    socket.broadcast.emit('updateTodoClient', data);
  });

});

server.listen(port, () => {
  console.log('Server running on port ' + port);
});
