const express = require('express');
const router = express.Router();
const signController = require('../../controllers/signpage/signController');

// add one user
router.post('/signup/add', signController.uploadImage, signController.addUser);

// check username exist?
router.get('/signup/findusername/:username', signController.findByRegisterUserName);

// login
router.post('/signin/auth', signController.authLoginUser);

module.exports = router;