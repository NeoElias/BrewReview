const { brewerySchema } = require('./schemas');
const { reviewSchema } = require('./schemas');
const Brewery = require('./models/brewery');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
  next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params; 
    const brewery = await Brewery.findById(id);
    if(!brewery.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/breweries/${id}`)
    }
    next();
}

module.exports.validateBrewery = (req, res, next) => {
  const {error} = brewerySchema.validate(req.body);
  if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const {id, reviewId } = req.params; 
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!')
      return res.redirect(`/breweries/${id}`)
  }
  next();
}
