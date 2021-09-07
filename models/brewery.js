const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    path: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/w_200');
});
const BrewerySchema = new Schema({
    title: String,
    image: [ImageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:  [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// query middleware
BrewerySchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Brewery', BrewerySchema)