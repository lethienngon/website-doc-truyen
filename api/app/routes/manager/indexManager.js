const express = require('express');
const router = express.Router();

router.use('/authors', require("./authorRoute"));

router.use('/categorys', require("./categoryRoute"));

router.use('/storys', require("./storyRoute"));

module.exports = router;