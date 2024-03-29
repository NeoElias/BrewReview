const user = require('../models/user');
const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createNewUser = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success',`Welcome to BrewReview, ${user.username}!`);
            res.redirect('/breweries');
        })  
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    const user =req.body.username;
    req.flash('success', `Welcome back, ${user}!`);
    const redirectUrl = req.session.returnTo || '/breweries';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {  
    req.logout();
    req.flash('success',' Goodbye!')
    res.redirect('/breweries');
}