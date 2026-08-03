const express = require('express');
const router = express.Router();
const { runBacktrackingAlgorithm } = require('../controllers/backtrackingController');

router.post('/run', runBacktrackingAlgorithm);

module.exports = router;
