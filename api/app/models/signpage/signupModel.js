const db = require('../../configs/database');

const User = function(user) {
    this.user_username = author.registerUsername;
    this.user_password = author.registerPassword;
    this.user_name = author.registerName;
    this.user_email = author.registerEmail;
    this.user_image = author.registerImage;
}

// User.add = (newUser, result) => {
//     db.query(`INSERT INTO user SET user_username=${newUser.user_username}
//                                 user_password=${newUser.user_password}
//                                 user_name=${newUser.user_name}
//                                 user_email=${newUser.user_email}
//                                 user_image=${newUser.user_image}`,
//         (err, res) => {
//             if (err) {
//                 // err syntax or ...
//                 console.log('Add user error: ', err);
//                 result(err, null);
//                 return;
//             }
//             // add user success
//             console.log('Add user: ', { id: res.insertId, ...newUser });
//             result(null, { id: res.insertId, ...newUser });
//         });
// };

User.findUserName = (username, result) => {
    db.query(`SELECT user_username FROM user WHERE user_username = '${username}'`, (err, res) => {
        if (err) {
            console.log('err...');
            result(err, null);
            return;
        }
        if (res.length) {
            console.log('Found username: ', res[0]);
            result(null, res[0]);
            return;
        }
        console.log('Not found user with username: ', username);
        result({ kind: 'not_found' }, null);
    });
};

module.exports = User;