const express = require('express');
const router = express.Router();
const jwtController = require('../../controllers/jwtController');
const signController = require('../../controllers/signpage/signController');

// add one user
router.post('/signup/add', signController.uploadImage, signController.addUser);

// check username exist?
router.get('/signup/findusername/:username', jwtController.verifyTokenAndAdminAuth, signController.findByRegisterUserName);

// login
router.post('/signin/auth', signController.authLoginUser);

// refresh token
router.post('/refresh', signController.requestRefreshToken);

// logged out
router.post('/logout', jwtController.verifyToken, signController.logoutUser);

module.exports = router;