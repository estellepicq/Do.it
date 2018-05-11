const app = require('express')();
const server = require('http').createServer(app);
const path = require('path');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 4000;

//Server is running
console.log("ToDoList app v2 is running on localhost:" + port);

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

server.listen(port);
