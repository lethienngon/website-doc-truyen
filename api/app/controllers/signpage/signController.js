const { Login, User } = require('../../models/signpage/signModel');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Config file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/admin/users")
    },
    filename: (req, file, cb) => {
        cb(null, 'user_' + Date.now() + path.extname(file.originalname))
    }
})

// Upload Image
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: '10000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimType && extname) {
            return cb(null, true)
        }
        cb('Give proper files fomate to upload')
    }
}).single('registerImage');

const addUser = (req, res) => {
    const user = new User({
        registerUsername: req.body.registerUsername,
        registerPassword: req.body.registerPassword,
        registerName: req.body.registerName,
        registerEmail: req.body.registerEmail,
        registerImage: req.file.path,
    });
    User.add(user, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Add user failed!!!"
            });
        else res.send({
            state: "success",
            message: "Add user success"
        });
    })
}

const findByRegisterUserName = (req, res) => {
    User.findUserName(req.params.username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send({
                    state: "warning",
                    message: `Not found user with username ${req.params.username}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error retrieving user with username " + req.params.username + "!!!"
                });
            }
        } else res.send(data);
    })
}

let resfreshTokenList = [];
const authLoginUser = (req, res) => {
    const userlogin = new Login({
        loginUsername: req.body.loginUsername,
        loginPassword: req.body.loginPassword,
    });
    Login.authUser(userlogin, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send({
                    state: "not_found",
                    message: `Not found user with username ${req.body.loginUsername}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error retrieving user with username " + req.body.loginUsername + "!!!"
                });
            }
        } else {
            console.log(data);
            const accessToken = jwt.sign({
                id: data.user_id,
                role: data.role_name
            }, process.env.JWT_ACCESS_KEY, { expiresIn: "20s" });
            const refreshToken = jwt.sign({
                id: data.user_id,
                role: data.role_name
            }, process.env.JWT_REFRESH_KEY, { expiresIn: "30d" });
            resfreshTokenList.push(refreshToken);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Day la khong cho Javascript lam viec voi Cookie
                secure: false, // Chrome thi true hay false dieu duoc, nhung Postman thi phai false moi dung duoc cookie
                path: "/",
                sameSite: "strict", // Co tai lieu noi chrome phai dung 'none' thi moi dung duoc
            })
            res.status(200).json({ accessToken });
        };
    })
}

const requestRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // console.log("Cookie Server: " + req.cookies.refreshToken);
    // console.log("Cookie Postman: " + req.headers.cookie);
    console.log(resfreshTokenList);
    if (!refreshToken) return res.status(401).json('You are not authenticated');
    if (!resfreshTokenList.includes(refreshToken)) {
        return res.status(403).json('Refresh token is not valid');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, data) => {
        if (err) {
            console.log(err);
        }
        resfreshTokenList = resfreshTokenList.filter((token) => token !== refreshToken);
        const newAccessToken = jwt.sign({
            id: data.id,
            role: data.role
        }, process.env.JWT_ACCESS_KEY, { expiresIn: "20s" });
        const newRefreshToken = jwt.sign({
            id: data.id,
            role: data.role
        }, process.env.JWT_REFRESH_KEY, { expiresIn: "30d" });
        resfreshTokenList.push(newRefreshToken);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true, // Day la khong cho Javascript lam viec voi Cookie
            secure: false, // Chrome thi true hay false dieu duoc, nhung Postman thi phai false moi dung duoc cookie
            path: "/",
            sameSite: "strict", // Co tai lieu noi chrome phai dung 'none' thi moi dung duoc
        })
        res.status(200).json({ newAccessToken });
    })
}

const logoutUser = (req, res) => {
    resfreshTokenList = resfreshTokenList.filter(token => token !== req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.status(200).json('Logged out!');
}

module.exports = {
    findByRegisterUserName,
    uploadImage,
    addUser,
    authLoginUser,
    requestRefreshToken,
    logoutUser,
};