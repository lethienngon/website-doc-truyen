const express = require('express');
const router = express.Router();

router.use('/authors', require("./author"));

module.exports = router;