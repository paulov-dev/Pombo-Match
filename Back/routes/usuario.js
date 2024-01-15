const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

// TODO: IMPLEMENTAR SISTEMA DE LOGs

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
                
                if (results.length == 0) {
                    conn.query(
                        'INSERT INTO usuario (primeiroNome_usuario, ultimoNome_usuario, dataNascimento_usuario, email_usuario, senha_usuario, fk_id_status) VALUES (?, ?, ?, ?, ?, ?)',
                        [usuario.primeiroNome, usuario.ultimoNome, usuario.dataNascimento, usuario.email, usuario.senha, 1],
                        (error, results, field) => {
                            conn.release();
            
                            if (error) { // TRATAR ERRO
                                return res.status(500).send({
                                    error: error,
                                    response: null
                                })
                            }            
                            res.status(201).send({
                                message: 'SUCESSO | Usuário cadastrado!',
                                id_usuario: results.insertId,
                                usuario: usuario
                            });
                        }
                    );
                } else {          

                    return res.status(409).send({ message: 'ERRO | Usuário já cadastrado!' });

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
                conn.release();
                
                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ response: results })

            }
        )
    })
});

// RETORNA UM USUARIO ESPECÍFICO
// TODO: IMPLEMENTAR SISTEMA QUE VALIDA SE O USUÁRIO EXISTE
router.get('/:id_usuario', (req, res, next) => {

    const id = req.params.id_usuario

    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM usuario WHERE id_usuario = ?;',
            [id],
            (error, results, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ response: results })

            }
        )
    }) 
});

// CONFIRMAÇÃO DO USUÁRIO - EMAIL
router.patch('/ativar', (req, res, next) => {

    const id = req.body.id_usuario

    mysql.getConnection((error, conn) => {

        conn.query( // VERIFICAR SE O USUÁRIO JÁ ESTÁ ATIVO
            `SELECT * FROM usuario WHERE id_usuario = ?`,
            [id],
            (error, results, fields) => {
                conn.release();
                
                if (results.length == 0){
                    return res.status(404).send({
                        response: "ERROR | Usuário não encontrado"
                    }) 
                }

                if (results[0].fk_id_status == 2) {
                    return res.status(409).send({
                        response: "ERROR | Usuário já se encontra ativo"
                    })
                }
                
                conn.query( // CONFIRMA O USUÁRIO
                    `UPDATE usuario
                    SET fk_id_status = ?
                    WHERE id_usuario = ?
                    `,
                    [2, id],
                    (error, results, fields) => {
                        conn.release();
        
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