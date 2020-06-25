const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    const googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            error: e
        });
    });

    User.findOne({ email: googleUser.email }, (error, userDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: { 
                        message: 'You must use your registered authentication credentials',
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((error, userDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;