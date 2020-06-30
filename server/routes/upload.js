const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const User = require('../models/User');
const Product = require('../models/Product');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No file selected'
            }
        });
    }

    let file = req.files.file;
    let fileSplit = file.name.split('.');
    let extension = fileSplit[fileSplit.length -1];

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                ext: extension,
                message: `Invalid extension. Permitted extensions are: ${validExtensions.join(', ')}`
            }
        });
    }

    const validTypes = ['users', 'products'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                type: type,
                message: `Invalid type. Permitted type are: ${validTypes.join(', ')}`
            }
        });
    }

    let filename = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    file.mv(`uploads/${type}/${filename}`, (error) => {
        if (error)
          return res.status(500).json({
              ok: false,
              error
        });

        if (type === 'users') {
            userImg(id, res, filename);
        } else {
            productImg(id, res, filename);
        }
    });
});

function userImg (id, res, filename) {
    User.findById(id, (error, userDB) => {
        if (error) {
            deleteFile(filename, 'users');
            return res.status(500).json({
              ok: false,
              error
            });
        }

        if (!userDB) {
            deleteFile(filename, 'users');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = filename;

        userDB.save((error, user) => {
            if (error) {
                return res.status(500).json({
                  ok: false,
                  error
                });
            }

            res.json({
                ok: true,
                message: 'File uploaded',
                user: userDB
            });
        });
    });
}

function productImg (id, res, filename) {
    Product.findById(id, (error, productDB) => {
        if (error) {
            deleteFile(filename, 'products');
            return res.status(500).json({
              ok: false,
              error
            });
        }

        if (!productDB) {
            deleteFile(filename, 'products');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Product not found'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = filename;

        productDB.save((error, product) => {
            if (error) {
                return res.status(500).json({
                  ok: false,
                  error
                });
            }

            res.json({
                ok: true,
                message: 'File uploaded',
                product: productDB
            });
        });
    });
}

function deleteFile(image, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;