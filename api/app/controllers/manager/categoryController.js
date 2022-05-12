const Category = require('../../models/manager/categoryModel');


const addCategory = (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });
    Category.add(category, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Add category failed!!!"
            });
        else res.status(200).send({
            state: "success",
            message: "Add category success"
        });
    });
};

const findAll = (req, res) => {
    const name = req.query.name;
    Category.getAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Some error occurred while retrieving Categorys!!!"
            });
        else res.status(200).send(data);
    });
};

const findAllIdName = (req, res) => {
    Category.getAllIdName((err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Some error occurred while retrieving Categorys!!!"
            });
        else res.status(200).send(data);
    });
};

const findByCategoryID = (req, res) => {
    Category.findId(req.params.categoryID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Category with id ${req.params.categoryID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error retrieving Category with id " + req.params.categoryID + "!!!"
                });
            }
        } else res.status(200).send(data);
    });
};

const updateCategory = (req, res) => {

    const categoryupdate = new Category({
        name: req.body.name,
        description: req.body.description
    });

    Category.update(req.params.categoryID, categoryupdate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Category with id ${req.params.categoryID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error update Category with id " + req.params.categoryID + "!!!"
                });
            }
        } else res.status(200).send({
            state: "success",
            message: `Category with id ${req.params.categoryID} was updated successfully`
        })
    })
};

const deleteCategory = (req, res) => {
    Category.delete(req.params.categoryID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Category with id ${req.params.categoryID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Could not delete Category with id " + req.params.categoryID + "!!!"
                });
            }
        } else
            res.send({
                state: "success",
                message: `Category with id ${req.params.categoryID} was deleted successfully`
            });
    });
};

module.exports = {
    addCategory,
    findAll,
    findAllIdName,
    findByCategoryID,
    updateCategory,
    deleteCategory
};