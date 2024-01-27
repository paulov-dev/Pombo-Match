const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

//TODO: IMPLEMENTAR COLETA DE IMG
// ACESSAR PARA PÁGINA DE CADASTRO
router.get('/', (req, res, next) => {

    const usuario = {
        id_usuario: req.body.id_usuario
    }

    const status_permitidos = [2, 3]

    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT * FROM usuario WHERE id_usuario = ?;`,
            [usuario.id_usuario],
            (error, results, fields) => {

                if (error) { return res.status(500).send({ error: error }) }

                if (results == "") { return res.status(200).send({ response: "ERROR | Usuário não cadastrado no sistema" }) }

                console.log(results)

                if (!status_permitidos.includes(results[0].fk_id_status)) { return res.status(403).send({ response: "ERROR | Você não tem permissão para acessar" }) }
                
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

    const status_permitidos = [2, 3]

    mysql.getConnection((error, conn) => {

        conn.query(
            `SELECT * FROM usuario WHERE id_usuario = ?`,
            [perfil.id_usuario],
            (error, results, fields) => {
                conn.release();

                if (results.length == 0) { return res.status(404).send({ response: "ERROR | Usuário não encontrado" }) }

                if (!status_permitidos.includes(results[0].fk_id_status)) { return res.status(403).send({ response: 'ERROR | Você não tem permissão para acessar' }) }

                conn.query(
                    `SELECT * FROM perfil WHERE fk_id_usuario = ?`,
                    [perfil.id_usuario],
                    (error, results, fields) => {
                        if (results.length == 0) {

                            conn.query(
                                `INSERT INTO perfil (fk_id_usuario, fk_id_curso, fk_id_genero, fk_id_orientacao, fk_id_interesse, bio_perfil) VALUES (?, ?, ?, ?, ?, ?)`,
                                [perfil.id_usuario, perfil.id_curso, perfil.id_genero, perfil.id_orientacao, perfil.id_interesse, perfil.bio],
                                (error, results, fields) => {
                                    conn.release();

                                    if (error) { return res.status(500).send({ error: error }) }

                                    return res.status(200).send({ response: "SUCESSO | Perfil criado e ativo!" })
                                }
                            )
                        } else {
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
                    }
                )
            }
        )
    })
})

module.exports = router