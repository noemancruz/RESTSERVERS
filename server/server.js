const express = require('express');
const bodyParser = require('body-parser');
require('./config/config2');
const mongoose = require('mongoose');
const app = express();

app.use(require('./routes/usuarios'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {

    if (err) throw err;

    console.log('base de datos ONLINE');
});

app.listen(process.env.PORT, () => {

    console.log(`Servidor escuchando en puerto ${process.env.PORT}`);

});