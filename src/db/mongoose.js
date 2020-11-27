const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

//Model definition
const User = mongoose.model('User', {
    name : {
        type: String
    },
    age : {
        type: Number
    }
})

//Model definition
const Task = mongoose.model('Task', {
    description : {
        type: String
    },
    completed : {
        type: Boolean
    }
})

const task = Task({
    description: 'Play guitar',
    completed: false
})

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log("Error!", error)
})