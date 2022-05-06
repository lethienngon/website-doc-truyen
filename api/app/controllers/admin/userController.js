const User = require('../../models/admin/userModel');
// const multer = require('multer');
// const path = require('path');

const findAll = (req, res) => {
    const name = req.query.name;
    User.getAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Some error occurred while retrieving Users!!!"
            });
        else res.send(data);
    });
};

const deleteUser = (req, res) => {
    User.delete(req.params.userID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found User with id ${req.params.userID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Could not delete User with id " + req.params.userID + "!!!"
                });
            }
        } else
            res.send({
                state: "success",
                message: `User with id ${req.params.userID} was deleted successfully`
            });
    });
};

module.exports = {
    findAll,
    deleteUser,
}