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

                if(results == ""){ return res.status(200).send({ response: "ERROR | Usuário não cadastrado no sistema" }) }
                
                if( results[0].fk_id_status != 2 ){ return res.status(200).send({ response: "ERROR | É necessário ativar seu usuário" }) }
                // IMPLEMENTAR PÁGINA DE ATUALIZAÇÃO DE PERFIL
                return res.status(200).send({ response: "OK" })
            }
        )
    })
})

// CRIAR PERFIL
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
    conn.query(
        `SELECT * FROM perfil WHERE id_usuario =?;`,
        [perfil.id_usuario],
        (error, results, fields) => {
            conn.release();
            //TODO: CORRIGIR PROBLEMA DE INSERÇÃO NO DB
            if (!results){                
                conn.query(
                    `SELECT * FROM perfil`                    
                ),
                (error, results, fields) => {
                    console.log(results)
                }                
            }       

            return res.status(200).send({ response: results })

        }
    )
    })
});

module.exports = router