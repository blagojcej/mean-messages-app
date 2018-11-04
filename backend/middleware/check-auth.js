const jwt = require('jsonwebtoken');

//Exporting Middleware in NodeJS and Express
module.exports = (req, res, next) => {
    try {
        // Get token from query
        // const token = req.query.auth

        // Get token from header
        //Split the Authorization Header by space and get the second element
        //First element in Authorization Header is "Bearer" keyword
        const token = req.headers.authorization.split(" ")[1];

        //If verification process does not throw an error, we have valid jwt
        jwt.verify(token, 'secret_this_should_be_longer');

        next();

    } catch (error) {
        res.status(401).json({ message: 'Auth Failed!' });
    }
};