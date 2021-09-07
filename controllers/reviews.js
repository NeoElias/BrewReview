const Review = require('../models/review');
const Brewery = require('../models/brewery');

module.exports.createReview = async(req, res) => {
    const brewery = await Brewery.findById(req.params.id);
    const review = new Review(req.body.review);
    const date = review.date;
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit'}
    const timeStamp = `${date.toLocaleDateString('en-US', dateOptions)} at ${date.toLocaleTimeString('en-US', timeOptions)}`;
    review.timestamp = timeStamp;
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