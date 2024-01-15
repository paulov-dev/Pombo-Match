const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../src/pages/index.html'));
});

module.exports = router