const db = require('../../configs/database');

const Author = function(author) {
    this.author_name = author.name;
    this.author_description = author.description;
    this.author_image = author.image;
};

Author.add = (newAuthor, result) => {
    db.query("INSERT INTO author SET ?", newAuthor, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        // console.log("created author: ", { id: res.insertId, ...newAuthor });
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

Author.delete = (id, result) => {
    db.query("DELETE FROM author WHERE author_id = ? ", id, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("error: ", err);
            result(true, err);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Author with the id
            console.log("not found author with id: ", id);
            result(true, { kind: "not_found" });
            return;
        }
        // delete success
        console.log("deleted author with id: ", id);
        result(false, res);
    });
};

module.exports = Author;