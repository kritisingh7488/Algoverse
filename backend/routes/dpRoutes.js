const express = require('express');
const router = express.Router();
const { runDPAlgorithm } = require('../controllers/dpController');

router.post('/run', runDPAlgorithm);

module.exports = router;
