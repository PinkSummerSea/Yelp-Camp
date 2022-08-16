const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if(e) return next();
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo
    }
    console.log(req.query.returnTo);
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    // const backURL=req.header('Referer') || '/';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(e => {
        if(e) {return next(e)}
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds')
    });
}