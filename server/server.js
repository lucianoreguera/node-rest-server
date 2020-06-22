const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
app.get('/usuario', function (req, res) {
  res.json('Get Usuario');
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        });
    } else {
        res.json({
            User: body
        });
    }    
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuario/:id', function (req, res) {
    res.json('Delete Usuario');
});

app.listen(process.env.PORT, () => console.log(`Listen on port ${process.env.PORT}`));