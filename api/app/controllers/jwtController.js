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

    verifyTokenAndAdminAuth: (req, res, next) => {
        jwtController.verifyToken(req, res, () => {
            if (req.user.id == req.params.userID || req.user.role == '01') {
                next();
            } else {
                console.log("You are not authorization admin");
                return res.status(403).json("You are not authorization admin");
            }
        })
    }
}

module.exports = jwtController;