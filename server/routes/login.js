const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (error, userDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: { 
                    message: 'Incorrect (username) or password',
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password )) {
            return res.status(400).json({
                ok: false,
                error: { 
                    message: 'Incorrect username or (password)',
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});

module.exports = app;