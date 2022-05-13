const express = require('express');
const router = express.Router();
const storyController = require('../../controllers/manager/storyController');
const jwtController = require('../../controllers/jwtController');

router.post('/add', jwtController.verifyTokenAndManagerAuth, storyController.uploadImage, storyController.addStory);

router.get('/', jwtController.verifyTokenAndManagerAuth, storyController.findAll);

router.delete('/delete/:storyID', storyController.deleteStory);

module.exports = router;