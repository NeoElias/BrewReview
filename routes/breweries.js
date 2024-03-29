const express = require('express');
const router = express.Router();
const breweries = require('../controllers/breweries');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBrewery } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(breweries.index))
    .post(isLoggedIn, upload.single('image'), validateBrewery,catchAsync(breweries.createBrewery))
    
router.get('/new', isLoggedIn, breweries.renderNewForm);

router.route('/:id')
    .get(catchAsync(breweries.showBrewery))
    .put(isLoggedIn, isAuthor, upload.single('image'), validateBrewery, catchAsync(breweries.updateBrewery))
    .delete(isLoggedIn, isAuthor, catchAsync(breweries.deleteBrewery))

/* edit brewery */
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(breweries.renderEditForm));

module.exports = router;