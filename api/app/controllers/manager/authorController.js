const Author = require('../../models/manager/authorModel');
const multer = require('multer');
const path = require('path');

// Config file storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/manager/authors")
    },
    filename: (req, file, cb) => {
        cb(null, 'author_' + Date.now() + path.extname(file.originalname))
    }
})

// Upload Image
const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimType && extname) {
            return cb(null, true)
        }
        cb('Give proper files fomate to upload')
    }
}).single('image')


const addAuthor = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Create a Author
    const author = new Author({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
    });
    // Save Author in the database
    Author.add(author, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Author."
            });
        else res.send(data);
    });
}

const findAll = (req, res) => {
    const name = req.query.name;
    Author.getAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Authors."
            });
        else res.send(data);
    });
};

module.exports = {
    addAuthor,
    upload,
    findAll
}