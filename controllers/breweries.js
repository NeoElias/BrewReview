const Brewery = require('../models/brewery');

module.exports.index = async (req, res) => {
    const breweries = await Brewery.find({});
    res.render('breweries/index', {breweries})
}

module.exports.renderNewForm = (req, res) => {
    res.render('breweries/new')
}

module.exports.createBrewery = async(req, res, next) => {
    const brewery = new Brewery(req.body.brewery);
    brewery.author = req.user._id;
    await brewery.save();
    req.flash('success', 'Successfully made a new brewery!');
    res.redirect(`/breweries/${brewery._id}`);
}

module.exports.showBrewery = async (req, res) => {
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
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const brewery = await Brewery.findById(id);
    if (!brewery) {
        req.flash('error', 'Cannot find that brewery!');
        return res.redirect('/breweries');       
    }
    res.render('breweries/edit', { brewery });
}

module.exports.updateBrewery = async(req, res) => {
    const { id } = req.params;
    const brewery = await Brewery.findByIdAndUpdate(id, {...req.body.brewery})
    req.flash('success', 'Successfully updated brewery!')
    res.redirect(`/breweries/${brewery._id}`)
}

module.exports.deleteBrewery = async (req, res) => {
    const { id } = req.params;
    await Brewery.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted brewery!')
    res.redirect('/breweries');
}