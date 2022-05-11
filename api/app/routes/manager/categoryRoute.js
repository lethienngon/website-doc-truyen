const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/manager/categoryController');
const jwtController = require('../../controllers/jwtController');

router.post('/add', jwtController.verifyTokenAndManagerAuth, categoryController.addCategory);

router.get('/', jwtController.verifyTokenAndManagerAuth, categoryController.findAll);

router.get('/:categoryID', jwtController.verifyTokenAndManagerAuth, categoryController.findByCategoryID);

router.patch('/edit/:categoryID', jwtController.verifyTokenAndManagerAuth, categoryController.updateCategory);

router.delete('/delete/:categoryID', jwtController.verifyTokenAndManagerAuth, categoryController.deleteCategory);

module.exports = router;