const express = require('express');
const router = express.Router();
const jwtController = require('../../controllers/jwtController');
const userController = require('../../controllers/admin/userController');


router.get('/', jwtController.verifyTokenAndAdminAuth, userController.findAll);

router.delete('/delete/:userID', jwtController.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;