const express = require('express');
const router = express.Router();
const signupController = require('../../controllers/signpage/signupController');

// add one user
// router.post('/add',signinController);

router.get('/findusername/:username', signupController.findByRegisterUserName);

module.exports = router;