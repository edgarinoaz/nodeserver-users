const express = require('express');
const app = express();
const User = require('../models/users');
const bcrypt = require('bcrypt');

app.get('/', (req, res) => {
    res.json('Hi there');
});

// get all users
app.get('/users', (req, res) => {
    res.json({ ok: true, message: 'Todo bien' });
});

// Create new user
app.post('/user', (req, res) => {
    let body = req.body

    //Try to encrypt the key.
    let password;
    try {
        password = bcrypt.hashSync(body.password, 10)
    }catch(e){
        if(e){
            return res.status(400).json({ ok: false, err: { message: 'Invalid password' } });
        }
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
app.put('/user/:id', (req, res) => {
    res.json({ ok: true, message: 'Todo bien' });
});

// Delete an user by ID
app.delete('/user/:id', (req, res) => {
    res.json({ ok: true, message: 'Todo bien' });
});

module.exports = app;