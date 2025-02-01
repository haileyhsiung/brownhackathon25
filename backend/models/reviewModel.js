const mongoose = require('mongoose'); //mongoose allows us to create schemas. mongo DB alone is schema-less

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  cafeName: { type: String, required: true },
  reviewContent: { type: String, required: true },
  reviewImage: { type: String, required: true },
  reviewRating: { type: Number, required: true },
});

const Review = mongoose.model('Review', reviewSchema); //applies the schema to a model 
module.exports = Review; //exports the model 
