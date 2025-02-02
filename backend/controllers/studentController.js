const Student = require("../models/studentModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//register a new user
const registerUser = async (req, res) => {
  try {
    const { studentName, bannerID, email } = req.body;

    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ error: "Student already registered" });
    }

    student = new Student({ studentName, bannerID, email });
    await student.save();

    res.status(201).json({ message: "Registration successful", student });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//login
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ error: "Register User" });
    }

    res.json({ message: "Login successful", student });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//to get top 10 students sorted by number of boxes for leaderboard
const getLeaderBoard = async (req, res) => {
  try {
    const students = await Student.find().sort({ totalBoxes: -1 }).limit(10);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//to get information for the current user to display on their personal stats page
const getStudentUser = async (req, res) => {
  try {
    const student = await Student.findOne({ bannerID: req.params.bannerID });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//to update totalBoxes and totalPoints count
const updateUserStats = async (req, res) => {
  try {
    const { bannerID } = req.params; // extract bannerID from URL
    const { change } = req.body; // extract how much to change by from request body

    // find student by bannerID and update total boxes
    const student = await Student.findOneAndUpdate(
      { bannerID: bannerID },
      { $inc: { totalBoxes: change, totalPoints: change } }, //update boxes and points count
      { new: true } // return the updated student data
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Student stats updated successfully",
      updatedStudent: student,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//to decrease total points when reward is claimed
const claimReward = async (req, res) => {
  try {
    const { bannerID } = req.params; // extract bannerID from URL
    const { change } = req.body; // extract how much to change by from request body

    // find student by bannerID and update total boxes
    const student = await Student.findOneAndUpdate(
      { bannerID: bannerID },
      { $inc: { totalPoints: change } }, //update points count
      { new: true } // return the updated student data
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Student reward updated successfully",
      updatedStudent: student,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const sendRewardEmail = async (req, res) => {
  try {
    const { email, reward } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reward Claim Confirmation",
      html: `
        <h1>Reward Claim Successful!</h1>
        <p>You've successfully claimed: ${reward}</p>
        <p>Please present this email to claim your reward.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send confirmation email" });
  }
};

//get banner ID from email
const getBannerID = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ bannerID: student.bannerID });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getLeaderBoard,
  getStudentUser,
  getBannerID,
  updateUserStats,
  claimReward,
  sendRewardEmail,
};
