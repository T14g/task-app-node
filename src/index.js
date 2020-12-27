const express = require('express');
//Ensures that mongose runs and connects to the database
require('./db/mongoose');

const usersRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT || 3000;

//Parses incoming request with json to objects
app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log("Server Running on Port " + port);
}); 