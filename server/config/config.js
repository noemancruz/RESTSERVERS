//PUERTO
process.env.PORT = process.env.PORT || 3000;



//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//FECHA DE EXPIRACION
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.EXPIRACION = process.env.EXPIRACION || 60 * 60 * 24 * 30;

//SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '534761879512-bt3lcuuaajhsoai5lp5ao128evr87hn7.apps.googleusercontent.com';

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = 'mongodb://user_cafe:pass123@ds251245.mlab.com:51245/cafe'
}
process.env.NODE_ENV = urlDB;