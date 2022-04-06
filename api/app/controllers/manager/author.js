const Author = require('../../models/manager/author');

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
    });
    // Save Author in the database
    Author.add(author, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Author."
            });
        else res.send(data);
    });
}

module.exports = {
    addAuthor
}