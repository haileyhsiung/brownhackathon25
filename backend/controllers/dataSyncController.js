const Student = require("../models/studentModel");
const {
  getDriveData,
  renameDriveFile,
} = require("../services/googleDriveService");

async function addDriveDataToDB(req, res) {
  try {
    // 1. Get data from Google Drive
    const driveData = await getDriveData();

    // 2. Aggregate box counts
    const boxCounts = driveData.reduce((acc, entry) => {
      const bannerID = entry.bannerID;
      const boxes = parseInt(entry.num_of_boxes, 10) || 0;
      acc[bannerID] = (acc[bannerID] || 0) + boxes;
      return acc;
    }, {});

    // 3. Prepare bulk update operations
    const bulkOps = Object.entries(boxCounts).map(([bannerID, boxes]) => ({
      updateOne: {
        filter: { bannerID },
        update: {
          $inc: {
            totalBoxes: boxes,
            totalPoints: boxes,
          },
        },
        upsert: true, // This will create a new document if it doesn't exist
      },
    }));

    // 4. Execute bulk update
    const result = await Student.bulkWrite(bulkOps);

    const fileId = "1ziP6ThsOu3z-DBFB1IRzxjrkHleNQWLA";

    // 5. Delete the file after successful merge
    const deletionResult = await renameDriveFile();

    res.status(200).json({
      message: "Data merged and file deleted successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      fileDeleted: deletionResult,
    });
  } catch (error) {
    console.error("Merge Error:", error);
    res.status(500).json({
      error: "Data merge failed",
      details: error.message,
    });
  }
}

// Optional: Function to sync data back to Drive (if needed)
async function syncToDrive(req, res) {
  try {
    const students = await Student.find({}, "bannerID totalBoxes");
    const driveFormat = students.map((student) => ({
      bannerID: student.bannerID,
      num_of_boxes: student.totalBoxes.toString(),
    }));

    await updateDriveData(driveFormat);
    res.status(200).json({
      message: "Sync to Drive successful",
      recordCount: driveFormat.length,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({
      error: "Sync failed",
      details: error.message,
    });
  }
}

module.exports = { addDriveDataToDB, syncToDrive };
