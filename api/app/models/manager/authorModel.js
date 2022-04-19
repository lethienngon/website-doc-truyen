const db = require('../../configs/database');

const Author = function(author) {
    this.author_name = author.name;
    this.author_description = author.description;
    this.author_image = author.image;
};

Author.add = (newAuthor, result) => {
    db.query("INSERT INTO author SET ?", newAuthor, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("error: ", err);
            result(err, null);
            return;
        }
        // add success
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
        // err syntax or ...
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        // find success
        console.log("author: ", res);
        result(null, res);
    });
};

Author.findId = (id, result) => {
    db.query(`SELECT * FROM author WHERE author_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found author: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found author with the id
        result({ kind: "not_found" }, null);
    });
}

Author.update = (id, author, result) => {
    db.query(
        "UPDATE author SET ? WHERE author_id = ?", [author, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                // not found author with the id
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("updated author: ", { id: id, ...author });
            result(null, { id: id, ...author });
        }
    );
}

Author.delete = (id, result) => {
    db.query("DELETE FROM author WHERE author_id = ? ", id, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Author with the id
            console.log("not found author with id: ", id);
            result({ kind: "not_found" }, null);
            return;
        }
        // delete success
        console.log("deleted author with id: ", id);
        result(null, res);
    });
};

module.exports = Author;