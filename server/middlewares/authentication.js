const jwt = require('jsonwebtoken');

const tokenVerify = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;

        next();
    });
};

const isAdmin = (req, res, next) => {
    const user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'The user is not an administrator'
            }
        });
    }
};

module.exports = {
    tokenVerify,
    isAdmin
};