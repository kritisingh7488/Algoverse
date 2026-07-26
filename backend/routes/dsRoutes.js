const express = require('express');
const router = express.Router();
const { runDSOperation } = require('../controllers/dsController');

router.post('/run', runDSOperation);

module.exports = router;
