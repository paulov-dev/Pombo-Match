const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

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
            `SELECT * FROM usuario WHERE email_usuario = ?`,
            [usuario.email],
            (error, results, field) => {

                console.log(results)
                
                if (results.length == 0) {
                    conn.query(
                        'INSERT INTO usuario (primeiroNome_usuario, ultimoNome_usuario, email_usuario, senha_usuario, status_usuario, dataNascimento_usuario) VALUES (?, ?, ?, ?, ?, ?)',
                        [usuario.primeiroNome, usuario.ultimoNome, usuario.email, usuario.senha, 0, usuario.dataNascimento],
                        (error, results, field) => {
                            conn.release(); // LIBERAR CONNECTION
            
                            if (error) { // TRATAR ERRO
                                return res.status(500).send({
                                    error: error,
                                    response: null
                                })
                            }            
                            res.status(201).send({
                                response: 'SUCESSO | Usuário cadastrado!',
                                id_usuario: results.insertId,
                                usuario: usuario
                            });
                        }
                    );
                } else {
                    // Usuário já cadastrado, envia a resposta e interrompe a execução
                    return res.status(409).send({ response: 'ERRO | Usuário já cadastrado!' });
                }
            }
        );
    });
});

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM usuario;',
            (error, results, fields) => {

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ response: results })

            }
        )
    })
});

// RETORNA UM USUARIO ESPECÍFICO
router.get('/:id_usuario', (req, res, next) => {

    const id = req.params.id_usuario

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM usuario WHERE id_usuario = ?;',
            [id],
            (error, results, fields) => {

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ response: results })

            }
        )
    }) 
});

// ATIVAÇÃO DO USUÁRIO
router.patch('/ativar', (req, res, next) => {

    const id = req.body.id_usuario

    mysql.getConnection((error, conn) => {

        conn.query( // VERIFICAR SE O USUÁRIO JÁ ESTÁ ATIVO
            `SELECT * FROM usuario WHERE id_usuario = ?`,
            [id],
            (error, results, fields) => {

                if (results[0].status_usuario == 1) {
                    return res.status(409).send({
                        response: "ERROR | Usuário já se encontra ativo"
                    })
                }
                
                conn.query( // ATIVA O USUÁRIO
                    `UPDATE usuario
                    SET status_usuario = ?
                    WHERE id_usuario = ?
                    `,
                    [1, id],
                    (error, results, fields) => {
        
                        if (error) { res.status(500).send({ error: error }) }
        
                        res.status(200).send({ response: "SUCESSO | Usuário ativo!" })
        
                    }
                )                
            }
        )
    })
})

// TODO: EXCLUSÃO DE USUÁRIO

module.exports = router