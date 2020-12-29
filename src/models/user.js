const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

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

const User = mongoose.model('User', userSchema);

module.exports = User;