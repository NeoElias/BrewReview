const express = require('express');
const router = express.Router({ mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Brewery = require('../models/brewery');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const brewery = await Brewery.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    brewery.reviews.push(review);
    await review.save()
    await brewery.save()
    req.flash('success', 'Your review was created!')
    res.redirect(`/breweries/${brewery._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId} = req.params;
    await Brewery.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review was deleted!')
    res.redirect(`/breweries/${id}`);
}))

module.exports = router;