const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./joi-schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorized = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorized');
        return res.redirect(`/campgrounds/${campground._id}`)
    };
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorized');
        return res.redirect(`/campgrounds/${campground._id}`)
    };
    next();
}

module.exports.checkReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}