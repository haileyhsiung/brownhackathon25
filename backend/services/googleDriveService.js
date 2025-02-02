const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });
drive.permissions.list(
  {
    fileId: "1ziP6ThsOu3z-DBFB1IRzxjrkHleNQWLA",
  },
  (err, res) => {
    if (err) {
      console.log("Error fetching permissions: ", err);
    } else {
      console.log("File Permissions: ", res.data);
    }
  }
);

const addPermission = async (fileId) => {
  const drive = await authenticate();

  // Adding the service account to the file permissions
  try {
    const res = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: "user",
        role: "writer", // or 'reader' if you only need read access
        emailAddress: "compjoster@compjoster.iam.gserviceaccount.com", // Service account email
      },
    });

    console.log("Permission Added:", res.data);
  } catch (err) {
    console.error("Error adding permission:", err.message);
  }
};

// Replace this with the file ID you're trying to access
const fileId = "1f10D8B62cSYV1j8AUD2wM09ZtBGzR5hH";
addPermission(fileId);

async function getDriveData() {
  try {
    const response = await drive.files.list({
      q: "name='newData.json' and mimeType='application/json'",
      fields: "files(id, name)",
    });

    if (!response.data.files?.length) {
      throw new Error("newData.json not found in Google Drive");
    }

    const file = await drive.files.get({
      fileId: response.data.files[0].id,
      alt: "media",
    });

    return file.data;
  } catch (error) {
    console.error("Drive API Error:", error.message);
    throw error;
  }
}

async function deleteDriveFile() {
  try {
    const response = await drive.files.list({
      q: "name='newData.json' and mimeType='application/json'",
      fields: "files(id, name)",
    });

    if (!response.data.files?.length) {
      throw new Error("newData.json not found for deletion");
    }

    await drive.files.delete({
      fileId: response.data.files[0].id,
    });

    return true;
  } catch (error) {
    console.error("Drive Delete Error:", error.message);
    throw error;
  }
}

module.exports = { getDriveData, deleteDriveFile };
