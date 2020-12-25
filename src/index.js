const express = require('express');
//Ensures that mongose runs and connects to the database
require('./db/mongoose')

//Import User Model
const User = require('./models/user');

const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

//Parses incoming request with json to objects
app.use(express.json());

//Setting Up an POST request handler
//Async always return a promise
//Express doesnt care what we return
app.post('/users', async (req, res) => {
    let user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send(user);
    }catch(e) {
        res.status(400).send(e);
    }
});

app.post('/tasks', async (req, res) => {
    let task = new Task(req.body);

    try {
        await task.save();
        //if task is saved send 201 response
        res.status(201).send(task);
    }catch (e) {
        res.status(400).send(e);
    }

});

//Get All Users
app.get('/users', async (req, res) => {

    try{
        const users = await  User.find({});
        res.send(users);

    } catch (e) {
        res.status(500).send(e);
    }

});


//Get one by ID
app.get('/users/:id', async (req, res) => {

    // _ prefixed variable names are considered private by convention but are still public.
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    }catch (e) {
        res.status(500).send();
    }

})

app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    }catch (e) {
        res.status(500).send(e);
    }

})

app.get('/tasks/:id', async (req, res) =>{
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id)

        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    }catch (e) {
        res.status(500).send();
    }
});

app.listen(port , () => {
    console.log("Server Running on Port " + port);
}); 