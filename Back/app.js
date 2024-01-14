const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')


// CONFIGURANDO ROTAS
const rotaUsuario = require('./routes/usuario')

// ATRIBUINDO ROTAS
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false})) // apenas dados simples
app.use(bodyParser.json()) // json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header',
    'Orignin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method == 'OPTIONS') {
        res.header('Access-Control,Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }

    next()

})

app.use('/usuario', rotaUsuario);

// TRATANDO ERROS
app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;