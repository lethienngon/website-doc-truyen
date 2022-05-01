const express = require('express');
const router = express.Router();

router.use('/signpage', require('./signpage/indexSignPage'));

router.use('/manager', require('./manager/indexManager'));

module.exports = router;