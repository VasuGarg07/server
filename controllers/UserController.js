const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

const userSchema = require('../models/User')

// Register User
exports.RegisterUser = (req, res, next) => {
    const errors = validationResult(req)
    console.log(req.body)

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array())
    } else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
            const user = new userSchema({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            });
            user.save().then((response) => {
                res.status(201).json({
                    message: 'User successfully created!',
                    result: response,
                })
            }).catch((error) => {
                res.status(500).json({
                    error: error,
                })
            })
        })
    }
}

// Sign In User
exports.SignIn = (req, res, next) => {

    let getUser;

    userSchema.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'User does not exist',
            })
        }
        getUser = user;
        console.log(bcrypt.compare(req.body.password, user.password))
        return bcrypt.compare(req.body.password, user.password)
    }).then((response) => {
        if (!response) {
            return res.status(401).json({
                message: 'Authentication failed',
            })
        }
        let jwtToken = jwt.sign(
            {
                email: getUser.email,
                userId: getUser._id,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '6h',
            },
        )
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id,
        })
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({
            message: 'Authentication failed',
        })
    })
}

// Get All Users
exports.GetAllUsers = (req, res, next) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).send(response)
        }
    })
}

// Get Single User
exports.GetUser = (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data,
            })
        }
    })
}

// Update User
exports.UpdateUser = (req, res, next) => {
    userSchema.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        (error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
                console.log('User successfully updated!')
            }
        },
    )
}

// Delete User
exports.DeleteUser = (req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data,
            })
        }
    })
}