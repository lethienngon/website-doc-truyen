const express = require('express');
const router = express.Router();
const signupController = require('../../controllers/signpage/signupController');

// add one user
router.post('/add', signupController.uploadImage, signupController.addUser);

// check username exist?
router.get('/findusername/:username', signupController.findByRegisterUserName);

module.exports = router;