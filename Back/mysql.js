const mysql = require('mysql2');
require('dotenv').config()

let pool = mysql.createPool({
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT
});

pool.getConnection((err, connection) => { // TESTA A CONEXÃO
    if (err) {
        console.error('BANCO DE DADOS | Erro ao obter conexão!', err);
        return;
    }
    console.log('BANCO DE DADOS | Conexão bem-sucedida!');
    

    connection.release();
});

exports.pool = pool