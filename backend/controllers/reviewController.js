const Review = require('../models/reviewModel');

// function to get all reviews from database, used in reviewRoutes
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ timestamp: -1 }); //in order of most recent to oldest 
        res.status(200).json(reviews); //sends the fetched reviews as a JSON response to the client with an HTTP status
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' }); //internal server error 
    }
};

// function to add review to database used in reviewRoutes
const addReview = async (req, res) => {
    const { reviewerName, cafeName, reviewContent, reviewImage, reviewRating } = req.body;
    //provide immediate feedback to client and avoid unecessary interactions with database 
    if (!reviewerName || !cafeName || !reviewContent || !reviewImage || !reviewRating) {
        return res.status(400).json({ error: 'All fields are required' }); //client side error, bad request
    }
    try {
        const newReview = new Review({
            reviewerName,
            cafeName,
            reviewContent,
            reviewImage,
            reviewRating
        });

        await newReview.save(); //saves document to database 
        res.status(200).json(newReview);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit review' });
      }
    };

//function to delete reviews from database, used in reviewRoutes
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
    };

module.exports = {getReviews, addReview, deleteReview};
