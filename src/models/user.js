const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const Task      = require('../models/task');

//Behind the scenes mongoose convert the object into a schema
//You can make use of schemas for advanced things like password encrypt
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password contains the word password')
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens : [{
        token :{
            type: String,
            required: true
        }
    }]
})

//Instance methods are acessible on instance
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ '_id': user._id.toString()}, 'testingJWT');

    //Concatenate item on the array and save
    user.tokens = user.tokens.concat({ token });
    
    //Save to the db
    await user.save();
    
    return token;
}

//Static methods are acessible on the MODEL
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        throw new Error('Unable to login!');
    }

    const isMatch  = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}

//Return the public data removing password and tokens from it
//res.send() will call this toJSON method
//you can manipulate the object here
//when you use json.send() stringfy is called and this toJSON method is called so
//to manipulate the json
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

//It's a virtual relationship between user and his tasks
// a relationship between two entities
//localField here
//foreignField there
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Hash password before saving 
userSchema.pre('save', async function(next) {
    //The individual user that will be saved
    const user = this;

    if(user.isModified('password')) {

        user.password = await bcrypt.hash(user.password, 8);
    }

    //When you done you must call next()
    next();
})

//Using middleware to delete users task when delete user account
//Its a good idea to use a middleware for this
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;