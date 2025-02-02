const Student = require('../models/studentModel');

//register a new user
const registerUser = async (req, res) => {
    try {
        const { studentName, bannerID, email, password } = req.body;

        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ error: "Student already registered" });
        }

        student = new Student({ studentName, bannerID, email, password });
        await student.save();

        res.status(201).json({ message: "Registration successful", student });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//login 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        if (!student || student.password !== password) {
            return res.status(400).json({ error: "Invalid credentials" });
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
const updateUserStats =  async (req, res) => {
    try {
        const { bannerID } = req.params;  // extract bannerID from URL
        const { change } = req.body;   // extract how much to change by from request body

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
            updatedStudent: student
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};


//to decrease total points when reward is claimed 
const claimReward =  async (req, res) => {
    try {
        const { bannerID } = req.params;  // extract bannerID from URL
        const { change } = req.body;   // extract how much to change by from request body

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
            updatedStudent: student
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};



module.exports = {registerUser, loginUser, getLeaderBoard, 
    getStudentUser, updateUserStats, claimReward};
