const express = require("express");
const Student = require("../models/studentModel");
//create router
const router = express.Router();
//imports functions from studentControllers used in the api endpoints
const {
  registerUser,
  loginUser,
  getLeaderBoard,
  getStudentUser,
  getBannerID,
  updateUserStats,
  claimReward,
  sendRewardEmail,
} = require("../controllers/studentController");

//API ENDPOINTS

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/leaderboard", getLeaderBoard);

router.get("/user/:bannerID", getStudentUser);

router.get("/user-bannerID/:email", getBannerID);

router.post("/update-stats/:bannerID", updateUserStats);

router.post("/claim-reward/:bannerID", claimReward);

router.post("/send-reward-email", sendRewardEmail);

//exports router object so that it is available to other files to import using require
module.exports = router;
