const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

// ACESSAR PARA PÁGINA DE CADASTRO
router.get('/', (req, res, next) => {

    const usuario = {
        id_usuario: req.body.id_usuario
    }

    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT * FROM usuario WHERE id_usuario = ?;`,
            [usuario.id_usuario],
            (error, results, fields) => {

                if (error) { return res.status(500).send({ error: error }) }

                if (results == "") { return res.status(200).send({ response: "ERROR | Usuário não cadastrado no sistema" }) }

                if (results[0].fk_id_status != 2) { return res.status(200).send({ response: "ERROR | É necessário ativar seu usuário" }) }
                // IMPLEMENTAR PÁGINA DE ATUALIZAÇÃO DE PERFIL
                return res.status(200).send({ response: "OK" })
            }
        )
    })
})

router.post('/atualizar', (req, res, next) => {

    const perfil = {
        id_usuario: req.body.id_usuario,
        id_curso: req.body.id_curso,
        id_genero: req.body.id_genero,
        id_orientacao: req.body.id_orientacao,
        id_interesse: req.body.id_interesse,
        bio: req.body.bio
    }

    mysql.getConnection((error, conn) => {

        conn.query( // VERIFICAR SE O USUÁRIO JÁ ESTÁ ATIVO
            `SELECT * FROM perfil WHERE fk_id_usuario = ?`,
            [perfil.id_usuario],
            (error, results, fields) => {
                conn.release();

                if (results.length == 0) {
                    return conn.query( // CONFIRMA O USUÁRIO
                        `INSERT INTO perfil (fk_id_usuario, fk_id_curso, fk_id_genero, fk_id_orientacao, fk_id_interesse, bio_perfil) VALUES (?, ?, ?, ?, ?, ?)`,
                        [perfil.id_usuario, perfil.id_curso, perfil.id_genero, perfil.id_orientacao, perfil.id_interesse, perfil.bio],
                        (error, results, fields) => {
                            conn.release();

                            if (error) { res.status(500).send({ error: error }) }

                            conn.query(
                                `UPDATE usuario
                                SET fk_id_status = ?
                                WHERE id_usuario = ?`,
                                [3, perfil.id_usuario],
                                (error, results, fields) => {
    
                                    if (error) { res.status(500).send({ error: error }) }
    
                                    res.status(200).send({ response: "SUCESSO | Perfil criado e ativo!" })
    
                                }
                            )
                        }
                    )
                }

                conn.query(
                    `UPDATE perfil
                    SET fk_id_curso = ?,
                     fk_id_genero = ?,
                     fk_id_orientacao = ?,
                     fk_id_interesse = ?,
                     bio_perfil = ?,
                     fk_id_usuario = ?`,
                    [perfil.id_curso, perfil.id_genero, perfil.id_orientacao, perfil.id_interesse, perfil.bio, perfil.id_usuario],
                    (error, results, fields) => {
                        conn.release()

                        if (error) { res.status(500).send({ error: error }) }

                        res.status(200).send({ response: 'SUCESSO | Usuário editado!' })

                    }
                )

            }
        )
    })
})

module.exports = router