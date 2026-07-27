const express = require('express');
const router = express.Router();
const { runGraphOperation } = require('../controllers/graphController');

router.post('/run', runGraphOperation);

module.exports = router;
