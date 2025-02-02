const express = require("express");
const { addDriveDataToDB } = require("../controllers/dataSyncController");

const router = express.Router();
router.post("/merge-drive-data", addDriveDataToDB);

module.exports = router;
