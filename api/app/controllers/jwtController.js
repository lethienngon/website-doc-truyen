const jwt = require('jsonwebtoken');

const jwtController = {

    // check authentication
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            // token: Bearer ...
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    console.log("Token is not valid");
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            console.log("You are not authenticated");
            return res.status(401).json("You are not authenticated");
        }
    },

    // Auth own
    verifyTokenAndOwnAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.id == req.params.userID) {
                next();
            } else {
                console.log("You are not authorization own");
                return res.status(403).json("You are not authorization own");
            }
        })
    },

    // Auth Member
    verifyTokenAndMemberAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.role == process.env.AUTH_MEMBER
                || req.user.role == process.env.AUTH_TRANSLATOR 
                || req.user.role == process.env.AUTH_MANAGER
                || req.user.role == process.env.AUTH_ADMIN) {
                next();
            } else {
                console.log("You are not authorization member");
                return res.status(403).json("You are not authorization member");
            }
        })
    },

    // Auth Translator
    verifyTokenAndTranslatorAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.role == process.env.AUTH_TRANSLATOR 
                || req.user.role == process.env.AUTH_MANAGER
                || req.user.role == process.env.AUTH_ADMIN) {
                next();
            } else {
                console.log("You are not authorization translator");
                return res.status(403).json("You are not authorization translator");
            }
        })
    },

    // Auth Manager
    verifyTokenAndManagerAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.role == process.env.AUTH_MANAGER
                || req.user.role == process.env.AUTH_ADMIN) {
                next();
            } else {
                console.log("You are not authorization manager");
                return res.status(403).json("You are not authorization manager");
            }
        })
    },

    // Auth Admin
    verifyTokenAndAdminAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.role == process.env.AUTH_ADMIN) {
                next();
            } else {
                console.log("You are not authorization admin");
                return res.status(403).json("You are not authorization admin");
            }
        })
    }
}

module.exports = jwtController;