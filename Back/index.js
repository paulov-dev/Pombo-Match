const express = require('express')
const app = express()

// TESTAR CONEXÃO COM DB
const db = require('./db/models')

// CONTROLLERS
const users = require('./controllers/users');

// ROTAS
app.use('/', users);

// START
app.listen(3000, () => {
    console.log('Servidor online na porta 3000 http://localhost:3000')
})