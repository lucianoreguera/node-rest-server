const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/User');
const { tokenVerify, isAdmin } = require('../middlewares/authentication');

const app = express();

app.get('/user', tokenVerify, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;
    
    User.find({status: true}, 'name email role google status img')
        .skip(from)
        .limit(limit)
        .exec((error, users) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            User.countDocuments({status: true}, (error, total) => {
                res.json({
                    ok: true,
                    total,
                    users
                });
            });
    });
});
  
app.post('/user', [tokenVerify, isAdmin], (req, res) => {
    let body = req.body;

    const newUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    newUser.save((error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });   
});
  
app.put('/user/:id', [tokenVerify, isAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    console.log(body);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        
        res.json({
            ok: true,
            User: userDB
        });
    }); 
});
  
 app.delete('/user/:id', [tokenVerify, isAdmin], (req, res) => {
    let id = req.params.id;

    // Delete from Data Base
    // User.findByIdAndRemove(id, (error, userDB) => {

    let newStatus = {
        status: false
    };
    
    // Change status
    User.findByIdAndUpdate(id, newStatus, { new: true }, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            User: userDB
        });
    }); 
});

module.exports = app;