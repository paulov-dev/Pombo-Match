const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool


router.post('/', (req, res) => {
    res.status(200).send({response: "Ok"})
})

module.exports = router