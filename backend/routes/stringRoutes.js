const express = require('express');
const router = express.Router();
const { runStringAlgorithm } = require('../controllers/stringController');

router.post('/run', runStringAlgorithm);

module.exports = router;
