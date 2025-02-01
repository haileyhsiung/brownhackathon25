const express = require('express');
const Review = require('../models/reviewModel');
//create router
const router = express.Router();
//imports functions from reviewControllers used in the api endpoints
const{addReview, getReviews, deleteReview} = require('../controllers/reviewController')


//API ENDPOINTS

//GET route to get object and sends response object
router.get('/', getReviews)

// POST route to add new data
router.post('/', addReview)

//DELETE route to delete reviews 
router.delete('/:id', deleteReview)

//exports router object so that it is available to other files to import using require 
module.exports = router;
