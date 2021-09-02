const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Brewery = require('../models/brewery');
const { isLoggedIn, isAuthor, validateBrewery } = require('../middleware')



router.get('/', async (req, res) => {
    const breweries = await Brewery.find({});
    res.render('breweries/index', {breweries});
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('breweries/new')
})

router.post('/', isLoggedIn, validateBrewery, catchAsync(async(req, res, next) => {
    // if(!req.body.brewery) throw new ExpressError('Invalid Brewery Data', 400);
    const brewery = new Brewery(req.body.brewery);
    brewery.author = req.user._id;
    await brewery.save();
    req.flash('success', 'Successfully made a new brewery!');
    res.redirect(`/breweries/${brewery._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const brewery = await Brewery.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!brewery) {
        req.flash('error', 'Cannot find that brewery!');
        return res.redirect('/breweries');       
    }
    res.render('breweries/show', { brewery });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const brewery = await Brewery.findById(id);
    if (!brewery) {
        req.flash('error', 'Cannot find that brewery!');
        return res.redirect('/breweries');       
    }
    res.render('breweries/edit', { brewery });
}));

router.put('/:id', isLoggedIn, isAuthor, validateBrewery, catchAsync(async(req, res) => {
    const { id } = req.params;
    const brewery = await Brewery.findByIdAndUpdate(id, {...req.body.brewery})
    req.flash('success', 'Successfully updated brewery!')
    res.redirect(`/breweries/${brewery._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Brewery.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted brewery!')
    res.redirect('/breweries');
}));

module.exports = router;