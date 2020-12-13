const express = require('express');
//Ensures that mongose runs and connects to the database
require('./db/mongoose')

//Import User Model
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

//Parses incoming request with json to objects
app.use(express.json());

//Setting Up an POST request handler
app.post('/users', (req, res) => {
    let user = new User(req.body);
    // console.log(user);
    user.save().then(() => {
        res.send(user);
    }).catch((e) => {
        res.status(400).send(e);//bad request, single line concept, chaining
    })
});

app.listen(port , () => {
    console.log("Server Running on Port " + port);
});