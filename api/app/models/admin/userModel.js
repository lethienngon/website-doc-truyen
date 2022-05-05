const db = require('../../configs/database');

const User = function(user) {
    this.user_id = user.id;
    this.user_name = user.name;
    this.user_email = user.email;
};

User.getAll = (name, result) => {
    db.query(`SELECT u.user_id, u.user_name, u.user_image, u.user_email, u.user_status, r.role_name 
                FROM user u join role_user ru on u.user_id=ru.user_id join role r on ru.role_id=r.role_id
                WHERE u.user_name LIKE '%${name}%'`,
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

module.exports = User;