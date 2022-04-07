const express = require('express');
const router = express.Router();

router.use('/authors', require("./authorRoute"));

module.exports = router;