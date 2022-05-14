const express = require('express');
const router = express.Router();
const authorController = require('../../controllers/manager/authorController');
const jwtController = require('../../controllers/jwtController');

// add one author
router.post('/add', jwtController.verifyTokenAndManagerAuth, authorController.uploadImage, authorController.addAuthor);

// findAll or find by name
router.get('/', jwtController.verifyTokenAndManagerAuth, authorController.findAll);

router.get('/idname', jwtController.verifyTokenAndManagerAuth, authorController.findAllIdName);

// find a author by authorID
router.get('/:authorID', jwtController.verifyTokenAndManagerAuth, authorController.findByAuthorID);

// edit a author by authorID
router.patch('/edit/:authorID', jwtController.verifyTokenAndManagerAuth, authorController.uploadImage, authorController.updateAuthor);

// delete a author
router.delete('/delete/:authorID', jwtController.verifyTokenAndManagerAuth, authorController.deleteAuthor);

module.exports = router;