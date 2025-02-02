const express = require("express");
const {
  addDriveDataToDB,
  syncToDrive,
} = require("../controllers/dataSyncController");

const router = express.Router();
router.post("/merge-drive-data", addDriveDataToDB);
router.post("/sync-drive-data", syncToDrive);

module.exports = router;
