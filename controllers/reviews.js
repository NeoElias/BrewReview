const Review = require('../models/review');
const Brewery = require('../models/brewery');

module.exports.createReview = async(req, res) => {
    const brewery = await Brewery.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    brewery.reviews.push(review);
    await review.save()
    await brewery.save()
    req.flash('success', 'Your review was created!')
    res.redirect(`/breweries/${brewery._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId} = req.params;
    await Brewery.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review was deleted!')
    res.redirect(`/breweries/${id}`);
}