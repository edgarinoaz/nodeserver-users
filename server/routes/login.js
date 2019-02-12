const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

app.post('/login', (req, res) => {
   let body = req.body;

   if(!body.password || !body.email){
    return res.status(404).json({ ok:false, err:{ message: 'User and password required' }});
   }

    User.findOne({ email:body.email }, (err, userDB) => {
        if(err){
            return res.status(500).json({ ok:false, err:{ message: 'The request could not be processed' }})
        }
        if(!userDB){
            return res.status(404).json({ ok:false, err:{ message: 'User or password invalid' }});
        }

        // Password Match
        if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(404).json({ ok:false, err:{ message: 'User or password invalid' }});
        }
        
        // Sign Token
        let token = jwt.sign( { user: userDB }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })
        res.json({ ok: true, user: userDB, token: token });
        
    })
});

module.exports = app;