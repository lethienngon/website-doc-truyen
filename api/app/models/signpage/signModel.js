const db = require('../../configs/database');
const cryptoJs = require('crypto-js');

const User = function(user) {
    this.user_username = user.registerUsername;
    this.user_password = cryptoJs.SHA256(
        user.registerPassword +
        user.registerUsername +
        process.env.KEY_PASS).toString();
    this.user_name = user.registerName;
    this.user_email = user.registerEmail;
    this.user_image = user.registerImage;
}

const Login = function(user) {
    this.user_username = user.loginUsername;
    this.user_password = cryptoJs.SHA256(
        user.loginPassword +
        user.loginUsername +
        process.env.KEY_PASS).toString();
}

User.add = (newUser, result) => {
    db.query("INSERT INTO user SET ?", newUser,
        (err, res) => {
            if (err) {
                // err syntax or ...
                console.log('Add user error: ', err);
                result(err, null);
                return;
            }
            // add user success
            console.log('Add user: ', { id: res.insertId, ...newUser });
            result(null, { id: res.insertId, ...newUser });
        });
};

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

Login.authUser = (userlogin, result) => {
    db.query(`SELECT user_username, user_password, role_name, u.user_id, u.user_name, u.user_image
        FROM user u join role_user ru on u.user_id=ru.user_id join role r on r.role_id=ru.role_id
        WHERE user_username = '${userlogin.user_username}'
        and user_password = '${userlogin.user_password}'`,
        (err, res) => {
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
            console.log('Not found user with username: ', userlogin);
            result({ kind: 'not_found' }, null);
        });
};

module.exports = { Login, User };