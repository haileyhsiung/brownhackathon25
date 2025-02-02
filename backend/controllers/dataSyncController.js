const Student = require("../models/studentModel");
const { getDriveData } = require("../services/googleDriveService");

async function addDriveDataToDB(req, res) {
  try {
    const driveData = await getDriveData();

    const boxCounts = driveData.reduce((acc, entry) => {
      const bannerID = entry.bannerID;
      const boxes = parseInt(entry.num_of_boxes, 10) || 0;
      acc[bannerID] = (acc[bannerID] || 0) + boxes;
      return acc;
    }, {});

    const bulkOps = Object.entries(boxCounts).map(([bannerID, boxes]) => ({
      updateOne: {
        filter: { bannerID },
        update: {
          $inc: {
            totalBoxes: boxes,
            totalPoints: boxes,
          },
        },
        upsert: true,
      },
    }));

    const result = await Student.bulkWrite(bulkOps);

    const renameDriveFile = await renameDriveFile();

    res.status(200).json({
      message: "Data merged and file deleted successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      renamed: renameDriveFile,
    });
  } catch (error) {
    console.error("Merge Error:", error);
    res.status(500).json({
      error: "Data merge failed",
      details: error.message,
    });
  }
}

module.exports = { addDriveDataToDB };
