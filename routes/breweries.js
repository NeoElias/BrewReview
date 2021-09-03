const express = require('express');
const router = express.Router();
const breweries = require('../controllers/breweries');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBrewery } = require('../middleware')


router.get('/', catchAsync(breweries.index));
router.get('/new', isLoggedIn, breweries.renderNewForm);
router.post('/', isLoggedIn, validateBrewery, catchAsync(breweries.createBrewery));
router.get('/:id', catchAsync(breweries.showBrewery));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(breweries.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, validateBrewery, catchAsync(breweries.updateBrewery));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(breweries.deleteBrewery));

module.exports = router;