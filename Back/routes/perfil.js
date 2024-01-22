const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool

// Criar o perfil
router.post('/inserir', (req, res, next) => {

   const perfil = {
    id_usuario: req.body.id_usuario,
    id_curso: req.body.id_curso,
    id_genero: req.body.id_genero
   }

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

    mysql.getConnection((err, conn) => {

        conn.query(
            ``
        )

    })

});

module.exports = router