const jwt  = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {

    try {
        //Bearer === Bearer token
        //Bearer tokens allow requests to authenticate using an access key, such as a JSON Web Token (JWT)
        const token = req.header('authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'testingJWT');

        //Id is in the token
        //String property name because using a special character on it
        //Find the correct user who was the token stored!
        const user = await User.findOne({ _id : decoded._id, 'tokens.token' : token });

        if(!user) {
            throw new Error();
        }

        //You added those two to req(request), remember
        req.user = user;
        req.token = token;
        next();

    } catch (e) {
        res.status(401).send({ 'error' : 'Please authenticate.'});
    }
}

module.exports = auth; 