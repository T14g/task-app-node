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
app.post('/users', (req, res) => {
    let user = new User(req.body);
    // console.log(user);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send(e);//bad request, single line concept, chaining
    }) 
});

app.post('/tasks', (req, res) => {
    let task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

//Get All Users
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send(e);
    })
});


//Get one by ID
app.get('/users/:id', (req, res) => {

    // _ prefixed variable names are considered private by convention but are still public.
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    }).catch((e) => {
        res.status(500).send();
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

app.get('/tasks/:id', (req, res) =>{
    const _id = req.params.id;
    
        Task.findById(_id).then((task) => {
            if(!task) {
                return res.status(404).send()
            }

            res.send(task);
        }).catch((e) => {
            res.status(500).send();
        })
});

app.listen(port , () => {
    console.log("Server Running on Port " + port);
}); 