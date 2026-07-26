const express = require('express');
const router = express.Router();
const { runTreeOperation } = require('../controllers/treeController');

router.post('/run', runTreeOperation);

module.exports = router;
