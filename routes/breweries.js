const express = require('express');
const router = express.Router();
const breweries = require('../controllers/breweries');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBrewery } = require('../middleware')

router.route('/')
    .get(catchAsync(breweries.index))
    .post(isLoggedIn, validateBrewery, catchAsync(breweries.createBrewery))

router.get('/new', isLoggedIn, breweries.renderNewForm);

router.route('/:id')
    .get(catchAsync(breweries.showBrewery))
    .put(isLoggedIn, isAuthor, validateBrewery, catchAsync(breweries.updateBrewery))
    .delete(isLoggedIn, isAuthor, catchAsync(breweries.deleteBrewery))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(breweries.renderEditForm));

module.exports = router;