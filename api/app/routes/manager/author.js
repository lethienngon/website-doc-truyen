const express = require('express');
const router = express.Router();
const controllerAuthor = require('../../controllers/manager/author')

router.get('/', (req, res, next) => {
    res.send("Get all author")
})

router.get('/:authorID', (req, res, next) => {
    res.send("Get one author with ID = " + req.params.authorID)
})

router.post('/add', controllerAuthor.addAuthor);

router.put('/edit/:authorID', (req, res, next) => {
    res.send("Edit author with ID = " + req.params.authorID)
})

router.delete('/delete/:authorID', (req, res, next) => {
    res.send("Delete author with ID = " + req.params.authorID)
})

module.exports = router;