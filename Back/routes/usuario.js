const express = require('express');
const router = express.Router();

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensage: 'Usando o GET dentro da rotas de Usuários'
    });
});

// CADASTRA UM USUARIO
router.post('/cadastro', (req, res, next) => {

    const usuario = {
        id_usuario: req.body.id_usuario,
        primeiroNome_usuario: req.body.primeiroNome_usuario,
        ultimoNome_usuario: req.body.ultimoNome_usuario,
        email_usuario: req.body.email_usuario,
        senha_usuario: req.body.senha_usuario,
        status_usuario: req.body.status_usuario,
        dataNascimento_usuario: req.body.dataNascimento_usuario
    }

    res.status(201).send({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: usuario
    });
});

// RETORNA OS DADOS DE UM USUARIO
router.get('/:id_usuario', (req, res, next) => {

    const id = req.params.id_usuario

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial!',
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: 'usando o GET de um produto',
            id: id
        })
    }        

});

// CADASTRO DE UM NOVO USUÁRIO
router.post('/cadastro/:id_usuario', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usuário cadastrado com sucesso'
    })
});

module.exports = router