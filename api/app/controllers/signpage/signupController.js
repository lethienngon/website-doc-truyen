const User = require('../../models/signpage/signupModel');
const multer = require('multer');
const path = require('path');

// Config file storage



const findByRegisterUserName = (req, res) => {
    User.findUserName(req.params.username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found user with username ${req.params.username}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error retrieving user with username " + req.params.username + "!!!"
                });
            }
        } else res.send(data);
    })
}

module.exports = {
    findByRegisterUserName
};