const Author = require('../../models/manager/authorModel');
const multer = require('multer');
const path = require('path');

// Config file storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/manager/authors")
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
}).single('image');

const addAuthor = (req, res) => {
    // Create a Author
    const author = new Author({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
    });

    // Save Author in the database
    Author.add(author, (err, data) => {
        if (err)
            res.send({
                state: 0,
                message: "Add author failed!!!"
            });
        else res.send({
            state: 1,
            message: "Add author success!!!"
        });

    });
}

const findAll = (req, res) => {
    const name = req.query.name;
    Author.getAll(name, (err, data) => {
        if (err)
            res.send({
                state: 0,
                message: err.message || "Some error occurred while retrieving Authors."
            });
        else res.send(data);
    });
};

const findByAuthorID = (req, res) => {
    Author.findId(req.params.authorID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send({
                    state: 2,
                    message: `Not found Author with id ${req.params.authorID}.`
                });
            } else {
                res.send({
                    state: 0,
                    message: "Error retrieving Author with id " + req.params.authorID
                });
            }
        } else res.send(data);
    });
}

const updateAuthor = (req, res) => {

    const authorupdate = new Author({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
    });

    Author.update(req.params.authorID, authorupdate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send({
                    state: 2,
                    message: `Not found Author with id ${req.params.authorID}.`
                });
            } else {
                res.send({
                    state: 0,
                    message: "Error update Author with id " + req.params.authorID
                });
            }
        } else res.send({
            state: 1,
            message: `AuthorID = ${req.params.authorID} was updated successfully!`
        })
    })
}

const deleteAuthor = (req, res) => {
    Author.delete(req.params.authorID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send({
                    state: 2,
                    message: `Not found Author with id ${req.params.authorID}.`
                });
            } else {
                res.send({
                    state: 0,
                    message: "Could not delete Author with id " + req.params.authorID
                });
            }
        } else
            res.send({
                state: 1,
                message: `AuthorID = ${req.params.authorID} was deleted successfully!`
            });
    });
};

module.exports = {
    uploadImage,
    addAuthor,
    findAll,
    findByAuthorID,
    updateAuthor,
    deleteAuthor
}