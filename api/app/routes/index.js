const express = require('express');
const router = express.Router();

router.use('/manager', require("./manager"));

module.exports = router;