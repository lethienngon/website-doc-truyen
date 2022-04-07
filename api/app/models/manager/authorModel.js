const db = require('../../configs/database');

const Author = function(author) {
    this.author_name = author.name;
    this.author_description = author.description;
    this.author_image = author.image;
};

Author.add = (newAuthor, result) => {
    db.query("INSERT INTO author SET ?", newAuthor, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created author: ", { id: res.insertId, ...newAuthor });
        result(null, { id: res.insertId, ...newAuthor });
    });
};

Author.getAll = (name, result) => {
    let query = "SELECT * FROM author";
    if (name) {
        query += ` WHERE author_name LIKE '%${name}%'`;
    }
    db.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("names: ", res);
        result(null, res);
    });
};

module.exports = Author;