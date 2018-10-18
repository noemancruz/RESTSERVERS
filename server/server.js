require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.NODE_ENV, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('base de datos ONLINE');
});
mongoose.set('useCreateIndex', true)

app.listen(process.env.PORT, () => {

    console.log(`Servidor escuchando en puerto ${process.env.PORT}`);

});