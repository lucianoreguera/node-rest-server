const fs = require('fs');
const path = require('path');
const express = require('express');

const { tokenImgVerify } = require('../middlewares/authentication');

const app = express();

app.get('/image/:type/:img', tokenImgVerify, (req, res) => {
    const type = req.params.type;
    const img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;