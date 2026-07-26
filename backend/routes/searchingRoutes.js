const express = require('express');
const router = express.Router();
const { runSearchingAlgorithm } = require('../controllers/searchingController');

router.post('/run', runSearchingAlgorithm);

module.exports = router;
