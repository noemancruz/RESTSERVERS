const express = require('./config/config');

const app = express();


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
app.delete('/usuario', (req, res) => {

    res.json('HOLA DELETE');

})

module.exports = app;