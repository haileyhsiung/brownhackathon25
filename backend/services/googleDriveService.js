const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join("", "./credentials.json"),
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
  clientOptions: {
    subject: "compjoster@compjoster.iam.gserviceaccount.com",
  },
});

const drive = google.drive({ version: "v3", auth });

const listPermissions = (fileId) => {
  return new Promise((resolve, reject) => {
    drive.permissions.list({ fileId: fileId }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.data);
      }
    });
  });
};

const addPermission = async (fileId) => {
  try {
    const res = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: "user",
        role: "writer",
        emailAddress: "compjoster@compjoster.iam.gserviceaccount.com",
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

async function getDriveData() {
  try {
    const response = await drive.files.list({
      q: "name='newData.json' and trashed=false",
      spaces: "drive",
      fields: "files(id, name, mimeType, parents, permissions)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (!response.data.files?.length) {
      throw new Error("newData.json not found in Google Drive");
    }

    const fileId = response.data.files[0].id;

    await drive.permissions.list({
      fileId: fileId,
      fields: "permissions(id, type, role, emailAddress)",
    });

    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
        fields: "id",
      });
    } catch (err) {
      // Permission already exists or couldn't be added
    }

    const file = await drive.files.get({
      fileId: fileId,
      alt: "media",
      supportsAllDrives: true,
    });

    return file.data;
  } catch (error) {
    throw error;
  }
}

async function renameDriveFile() {
  try {
    const response = await drive.files.list({
      q: "name='newData.json' and mimeType='application/json' and trashed=false",
      spaces: "drive",
      fields: "files(id, name)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (!response.data.files?.length) {
      throw new Error("newData.json not found for renaming");
    }

    const fileId = response.data.files[0].id;

    const renameResponse = await drive.files.update({
      fileId: fileId,
      requestBody: {
        name: "trash.json",
      },
      fields: "id,name",
      supportsAllDrives: true,
    });

    return renameResponse.data;
  } catch (error) {
    throw error;
  }
}

async function listFolderContents() {
  try {
    const response = await drive.files.list({
      spaces: "drive",
      fields: "files(id, name, mimeType, modifiedTime, size, owners)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    return response.data.files;
  } catch (error) {
    throw error;
  }
}

const fileId = "1ziP6ThsOu3z-DBFB1IRzxjrkHleNQWLA";

async function main() {
  try {
    const files = await listFolderContents();
    await listPermissions(fileId);
    await addPermission(fileId);
    const data = await getDriveData();
  } catch (error) {
    // Handle error
  }
}

main();

module.exports = { getDriveData, renameDriveFile };
