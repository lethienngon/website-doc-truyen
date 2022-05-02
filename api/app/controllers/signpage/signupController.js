const User = require('../../models/signpage/signupModel');
const multer = require('multer');
const path = require('path');

// Config file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/admin/users")
    },
    filename: (req, file, cb) => {
        cb(null, 'author_' + Date.now() + path.extname(file.originalname))
    }
})

// Upload Image
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: '10000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimType && extname) {
            return cb(null, true)
        }
        cb('Give proper files fomate to upload')
    }
}).single('registerImage');

const addUser = (req, res) => {
    const user = new User({
        registerUsername: req.body.registerUsername,
        registerPassword: req.body.registerPassword,
        registerName: req.body.registerName,
        registerEmail: req.body.registerEmail,
        registerImage: req.file.path,
    });

    console.log(req.file.path)
    console.log(req.body)

    User.add(user, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Add user failed!!!"
            });
        else res.send({
            state: "success",
            message: "Add user success"
        });
    })
}

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
    findByRegisterUserName,
    uploadImage,
    addUser
};