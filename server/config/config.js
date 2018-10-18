//PUERTO
process.env.PORT = process.env.PORT || 3000;




process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = 'mongodb://user_cafe:pass123@ds251245.mlab.com:51245/cafe'
}
process.env.NODE_ENV = urlDB;