const db = require('../../configs/database');

const Author = function(author) {
    this.author_name = author.name;
    this.author_description = author.description;
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

module.exports = Author;