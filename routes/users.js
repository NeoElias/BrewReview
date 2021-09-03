const express = require('express');
const passport = require('passport');
const router = express.Router();
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

router.get('/register', users.renderRegisterForm);
router.post('/register', catchAsync(users.createNewUser));
router.get('/login', users.renderLoginForm);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser);
router.get('/logout', users.logoutUser)

module.exports = router;