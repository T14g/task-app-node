const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');

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

    }
})

//Standart function because you will need the "this"
userSchema.pre('save', async function(next) {
    //The individual user that will be saved
    const user = this;

    if(user.isModified('password')) {

        user.password = await bcrypt.hash(user.password, 8);
    }

    //When you done you must call next()
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;