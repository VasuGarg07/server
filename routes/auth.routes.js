const express = require('express')
const { check } = require('express-validator')

const authorize = require('../middleware/auth')
const userControllers = require("../controllers/UserController")

const router = express.Router()

// Sign-up
router.post(
    '/register-user',
    [
        check('name').not().isEmpty().isLength({ min: 6, max: 10 }).withMessage('Name must be 6-10 characters long'),
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password should be atleast 8 characters long').not().isEmpty().isLength({ min: 8 }),
    ],
    userControllers.RegisterUser,
);

// Sign-in
router.post('/signin', userControllers.SignIn);

// Get Users
router.route('/').get(userControllers.GetAllUsers);

// Get Single User
router.route('/user-profile/:id').get(authorize, userControllers.GetUser);

// Update User
router.route('/update-user/:id').patch(userControllers.UpdateUser)

// Delete User
router.route('/delete-user/:id').delete(userControllers.DeleteUser)

module.exports = router