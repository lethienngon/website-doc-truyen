const express = require('express');
const router = express.Router();

// router.use('/signin', require('./signIn'));

router.use('/signup', require('./signUp'));

module.exports = router;