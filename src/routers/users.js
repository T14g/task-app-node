const express = require('express');
const User = require('../models/user');
const router = new express.Router();


router.post('/users', async (req, res) => {
    let user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Get All Users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);

    } catch (e) {
        res.status(500).send(e);
    }

});


//Get one by ID
router.get('/users/:id', async (req, res) => {

    // _ prefixed variable names are considered private by convention but are still public.
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send();
    }

})

router.patch('/users/:id', async (req, res) => {

    //Return an array of strings with all object properties
    const updates = Object.keys(req.body);

    const allowedUpdates = ['name', 'email', 'password', 'age'];

    //Every == all or none
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ 'error': 'Invalid updates' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(400).send();
        }

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;