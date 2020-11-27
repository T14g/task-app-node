//CRUD - create read update delete

//Mongodb module
const mongodb = require('mongodb')

//Acess to database
const MongoClient = mongodb.MongoClient

//Use full ip > use of localhost
const connectionURL = 'mongodb://127.0.0.1:27017'

//With mongodb there is no need to create this database on GUI for exemple,
//By picking this name mongodb will automatcly create this for us
const databaseName  = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    //Return ensures the code will stop
    if (error) {
        return console.log("Unable to connect to database!")
    }

    const db = client.db(databaseName)

    db.collection('users').insertOne({
        'name' : 'Tiago',
        'age'   : 26
    })

})