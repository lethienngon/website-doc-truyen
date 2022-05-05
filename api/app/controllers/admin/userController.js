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

module.exports = {
    findAll,
}