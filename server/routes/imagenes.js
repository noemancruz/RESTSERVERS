const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let imagenUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(imagenUrl)) {
        res.sendFile(imagenUrl)
    } else {
        imagenUrl = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(imagenUrl);

    }


})


module.exports = app;