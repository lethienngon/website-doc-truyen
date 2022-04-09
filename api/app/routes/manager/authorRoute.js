const express = require('express');
const router = express.Router();
const authorController = require('../../controllers/manager/authorController')

// findAll or find by name
router.get('/', authorController.findAll);

router.get('/:authorID', (req, res, next) => {
    res.send("Get one author with ID = " + req.params.authorID)
})

// Add Author
router.post('/add', authorController.uploadImage, authorController.addAuthor);

router.put('/edit/:authorID', (req, res, next) => {
    res.send("Edit author with ID = " + req.params.authorID)
})

router.delete('/delete/:authorID', (req, res, next) => {
    res.send("Delete author with ID = " + req.params.authorID)
})

module.exports = router;