const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensage: 'Usando o GET dentro da rotas de Usuários'
    });
});

// CADASTRA UM USUARIO
router.post('/cadastro', (req, res, next) => {

    const usuario = {
        primeiroNome: req.body.primeiroNome_usuario,
        ultimoNome: req.body.ultimoNome_usuario,
        email: req.body.email_usuario,
        senha: req.body.senha_usuario,
        dataNascimento: req.body.dataNascimento_usuario
    }

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO usuario (primeiroNome_usuario, ultimoNome_usuario, email_usuario, senha_usuario, status_usuario, dataNascimento_usuario) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario.primeiroNome, usuario.ultimoNome, usuario.email, usuario.senha, 0, usuario.dataNascimento],
            (error, resultado, field) => {
                conn.release(); // LIBERAR CONNECTION

                if (error) { // TRATAR ERRO
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                res.status(201).send({
                    mensagem: 'Usuário cadastrado com sucesso!',
                    id_usuario: resultado.insertId,
                    usuario: usuario
                });
            }
        )
    })

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