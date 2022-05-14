const db = require('../../configs/database');

const User = function(user) {
    this.user_id = user.id;
    this.user_name = user.name;
    this.user_email = user.email;
};

User.getAll = (name, result) => {
    db.query(`SELECT u.user_id, u.user_name, u.user_image, u.user_email, u.user_status, r.role_name , r.role_id
                FROM user u join role r on u.role_id=r.role_id
                WHERE u.user_name LIKE '%${name}%' and r.role_id != '00'`,
        (err, res) => {
            // err syntax or ...
            if (err) {
                console.log("Find error: ", err);
                result(err, null);
                return;
            }
            // find success
            console.log("User: ", res);
            result(null, res);
        });
};

User.update = (id, status, role, result) => {
    if(role=='00'){
        result(err, null);
        return;
    }
    let user = {
        user_status: status,
        role_id: role
    }
    db.query("UPDATE user SET ? WHERE user_id = ? and role_id != '00'", [user, id], 
        (err, res) => {
            if (err) {
                console.log("Updated error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                console.log("Not found user with id: ", id);
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Updated user: ", { id: id });
            result(null, { id: id });
        }
    );
};

User.delete = (id, result) => {
    db.query(`DELETE FROM user WHERE user_id = ${id} and role_id != '00'`, (err, res) => {
        if (err) {
            console.log("Deleted error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            console.log("Not found user with id: ", id);
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted user with id: ", id);
        result(null, res);
    });
};

module.exports = User;