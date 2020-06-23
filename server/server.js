const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (error, res) => {
    if (error) throw error;

    console.log('Data Base ONLINE');
});

app.listen(process.env.PORT, () => console.log(`Listen on port ${process.env.PORT}`));