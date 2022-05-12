const express = require('express');
const router = express.Router();
const authorController = require('../../controllers/manager/authorController');

// add one author
router.post('/add', authorController.uploadImage, authorController.addAuthor);

// findAll or find by name
router.get('/', authorController.findAll);

router.get('/idname', authorController.findAllIdName);

// find a author by authorID
router.get('/:authorID', authorController.findByAuthorID);

// edit a author by authorID
router.put('/edit/:authorID', authorController.uploadImage, authorController.updateAuthor);

// delete a author
router.delete('/delete/:authorID', authorController.deleteAuthor);

module.exports = router;