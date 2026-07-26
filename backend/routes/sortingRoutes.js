const express = require('express');
const router = express.Router();
const { runSortingAlgorithm } = require('../controllers/sortingController');

router.post('/run', runSortingAlgorithm);

module.exports = router;
