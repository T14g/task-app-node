const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

//Model definition
const User = mongoose.model('User', {
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password contains the word password')
            }
        }
    },

    age : {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }

    }
})

//Model definition
const Task = mongoose.model('Task', {
    description : {
        type: String,
        trim: true,
        required: true
    },
    completed : {
        type: Boolean,
        default: false
    }
})

const task = Task({
    description: '                  Play guitar',
})

const me = User({
    name: 'Tiago',
    age: 26,
    email: 'mike@gmail.com',
    password: '12345678'
})

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log("Error!", error)
})