const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;

    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(user);
            // Check if user exists
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed!'
                });
            }
            fetchedUser = user;

            // Check if password match
            return bcrypt.compare(req.body.password, user.password);

        })
        // result of compare, the result will be true if comparing is successful, or false comparing failed
        .then(result => {
            console.log(result);
            // if result is false 
            if (!result) {
                return res.status(401).json({
                    message: 'Auth Failed!'
                });
            }

            // If comparing is successful create json web token
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_longer', { expiresIn: '1h' });

            //we don't need return statement, because we have no other code below
            console.log(token);
            res.status(200).json({
                token: token,
                expiresIn: 3600
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: 'Auth Failed!'
            });
        });
});

module.exports = router;