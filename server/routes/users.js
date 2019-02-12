const express = require('express');
const app = express();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { validationToken, adminValidator } = require('../middlewares');

app.get('/', (req, res) => {
    res.json('Hi there');
});

// get all users
app.get('/users', [ validationToken, adminValidator], (req, res) => {

    let from = Number(req.query.from) || 0;
    let max  = Number(req.query.max) || 5;

    // Get only active users
    User.find({ status:true })
    .skip(from)
    .limit(max)
    .exec((err, users) => {
        if(err){ return res.status(500).json({ ok: false, err }); }

        User.count({}, (err, count) => {
        if(err){ return res.status(500).json({ ok: false, err }); }

        // Send results
        res.json({ ok: true, users, count });
    })
    });
});

// Create new user
app.post('/user', (req, res) => {
    let body = req.body

    //Try to encrypt the key.
    let password;
    try {
        password = bcrypt.hashSync(body.password, 10)
    }catch(e){
        return res.status(400).json({ ok: false, err: { message: 'Invalid password' } });
    }

    let newUser = new User({
        name: body.name,
        email: body.email,
        password: password
    });

    // Insert user in DB, return new User
    newUser.save((err, userDB) => {
        if(err){
            return res.status(400).json({ ok: false, err });
        }
        console.log('user registered successfully.\n');
        res.json({ ok: true, user: userDB });
    });
});

// Update an user by ID
app.put('/user/:id', [ validationToken, adminValidator], (req, res) => {
    let id = req.params.id;
    let update = _.pick(req.body, ['name', 'email', 'status']);
    
    User.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, updatedUser) => {
        if(err) {
            return res.status(400).json({ ok: false, err });
        }
        
        if(!updatedUser) {
            return res.status(404).json({ ok: false, err: { message: 'Invalid ID'} });
        }
        
        res.json({ ok: true, user: updatedUser });
    });
});

// Delete an user by ID
app.delete('/user/:id', [ validationToken, adminValidator], (req, res) => {
    let id = req.params.id;
    
    User.findByIdAndUpdate(id, { status: false }, { new: true, runValidators: true }, (err, updatedUser) => {
        if(err) {
            return res.status(400).json({ ok: false, err });
        }
        
        if(!updatedUser) {
            return res.status(404).json({ ok: false, err: { message: 'Invalid ID'} });
        }
        
        res.json({ ok: true, user: updatedUser });
    });
});

module.exports = app;