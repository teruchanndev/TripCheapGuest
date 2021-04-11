const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer')[1];
        // console.log(req);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {email: decodedToken.email, customerId: decodedToken.customerId};
        next();
    } catch (error) {
        // console.log(req);
        res.status(401).json({
            message: 'You are not authenticated!'
        });
    }

}
