const db = require('../../configs/database');

const Category = function(category) {
    this.category_name = category.name;
    this.category_description = category.description;
};

Category.add = (newCategory, result) => {
    db.query("INSERT INTO category SET ?", newCategory, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("Add error: ", err);
            result(err, null);
            return;
        }
        // add success
        console.log("Add category: ", { id: res.insertId, ...newCategory });
        result(null, { id: res.insertId, ...newCategory });
    });
};

Category.getAll = (name, result) => {
    db.query(`SELECT * FROM category WHERE category_name LIKE '%${name}%'`, (err, res) => {
        // err syntax or ...
        if (err) {
            console.log("Find error: ", err);
            result(err, null);
            return;
        }
        // find success
        console.log("Category: ", res);
        result(null, res);
    });
};

Category.getAllIdName = (result) => {
    db.query('SELECT category_id, category_name FROM category', (err, res) => {
        // err syntax or ...
        if (err) {
            console.log("Find error: ", err);
            result(err, null);
            return;
        }
        // find success
        console.log("Category: ", res);
        result(null, res);
    });
};

Category.findId = (id, result) => {
    db.query(`SELECT * FROM category WHERE category_id = ${id}`, (err, res) => {
        if (err) {
            // err
            console.log("Find by ID error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            // find by id success
            console.log("Found catrgory: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found author with the id
        console.log("Not found category with id: ", id);
        result({ kind: "not_found" }, null);
    });
};

Category.update = (id, category, result) => {
    let query = 'UPDATE category SET ';
    console.log(category.category_name)
    if(category.category_name) {
        query += `category_name = '${category.category_name}'`
    }
    if(category.category_description){
        if(category.category_name) {
            query += ', '
        }
        query += `category_description = '${category.category_description}'`
    }
    query += ` WHERE category_id = ${id}`
    db.query(query, (err, res) => {
            if (err) {
                // err
                console.log("Updated error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // not found category with the id
                console.log("Not found category with id: ", id);
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Updated category: ", { id: id, ...category });
            result(null, { id: id, ...category });
        }
    );
};

Category.delete = (id, result) => {
    db.query("DELETE FROM category WHERE category_id = ? ", id, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("Deleted error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found category with the id
            console.log("Not found category with id: ", id);
            result({ kind: "not_found" }, null);
            return;
        }
        // delete success
        console.log("Deleted category with id: ", id);
        result(null, res);
    });
};

module.exports = Category;