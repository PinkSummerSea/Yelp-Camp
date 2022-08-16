const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { checkReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router;