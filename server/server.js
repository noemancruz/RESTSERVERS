const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');
const app = express();

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    //parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {

    res.json('HOLA GET');

})
app.post('/usuario/:id', (req, res) => {

    let body = req.body;
    res.json({
        body
    })
})
app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    res.json({
        id
    });

})
app.delete('/', (req, res) => {

    res.json('HOLA DELETE');

})

app.listen(3000, () => {

    console.log(`Servidor escuchando en puerto ${process.env.PORT}`);

})